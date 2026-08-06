# Tech Spec：Go-Live Site Clearance（V1）

| 字段 | 内容 |
|------|------|
| 状态 | Draft v0.1 |
| 日期 | 2026-08-06 |
| 关联 | [PRD.md](./PRD.md) · [DEPLOYMENT.md](./DEPLOYMENT.md) |
| 范围 | M1–M2 可实现；落地页内容模板另附 |

本文定义实现契约。产品体验验收以 PRD §4.2 为准；部署拓扑以 DEPLOYMENT 为准。

---

## 1. 技术栈与仓库

| 层 | 选型 |
|----|------|
| 运行时 | Node.js 20+ |
| 框架 | Next.js 15（App Router）+ TypeScript |
| 样式 | 任选其一：Tailwind CSS（推荐，快） |
| 托管 | Vercel（默认） |
| 报告存储 V1 | Vercel KV **或** 无存储降级（见 §7） |
| 邮件 | Resend（优先）/ Brevo |
| 包管理 | pnpm |

### 1.1 目录约定

```text
/
├── app/
│   ├── page.tsx                 # 首页 + 扫描器
│   ├── layout.tsx
│   ├── report/[id]/page.tsx    # 可分享报告
│   ├── methodology/page.tsx
│   ├── about/page.tsx
│   ├── (landing)/               # 工具/场景落地页
│   │   └── [slug]/page.tsx
│   └── api/
│       ├── scan/route.ts        # POST 扫描
│       ├── report/[id]/route.ts # GET 报告 JSON（可选）
│       └── email-report/route.ts# POST 邮件（M2）
├── components/
│   ├── ScanForm.tsx
│   ├── ClearanceBadge.tsx       # Go / No-Go 章
│   ├── FindingList.tsx
│   └── CopyFixButton.tsx
├── lib/
│   ├── scan/
│   │   ├── types.ts
│   │   ├── ssrf.ts
│   │   ├── fetch-target.ts
│   │   ├── parse-html.ts
│   │   ├── rules/               # 每类检查一个模块
│   │   ├── score.ts
│   │   ├── fixes.ts             # Copy fix 文案库
│   │   └── run-scan.ts
│   ├── report/store.ts
│   ├── rate-limit.ts
│   └── analytics.ts
├── content/landings/*.mdx       # 落地页（可后置）
└── tests/scan/                  # 规则与 SSRF 单测
```

---

## 2. 核心类型

```ts
type Clearance = "go" | "no_go";

type Severity = "blocker" | "warning" | "pass" | "info";

type CheckId =
  | "https_redirect"
  | "tls_cert"
  | "security_headers"
  | "robots_txt"
  | "sitemap"
  | "noindex"
  | "title_description"
  | "canonical"
  | "open_graph"
  | "favicon"
  | "platform_fingerprint"; // P1

type StackHint = "nextjs" | "vercel" | "stripe" | "auth" | "generic";

interface Finding {
  id: CheckId | string;          // 子项可用 security_headers.hsts
  severity: Severity;
  title: string;                 // 短标题
  summary: string;               // 事故语言 / 现状
  impact?: string;               // 会发生什么（Blocker/Warning 必填）
  evidence?: string;             // 摘录：头值、meta 等（截断）
  fix?: {
    label: string;               // e.g. "Next.js headers()"
    language: "js" | "ts" | "txt" | "bash";
    code: string;                // 可复制
  };
}

interface ScanRequest {
  url: string;
  stack?: StackHint[];           // P1；V1 可忽略
  focus?: CheckId;               // 落地页高亮用，不影响规则全集
}

interface ScanResult {
  id: string;                    // report id
  clearance: Clearance;
  score: number;                 // 0–100，从属于 clearance
  urlInput: string;
  urlFinal: string;              // 跟随跳转后的最终 URL
  scannedAt: string;             // ISO
  expiresAt: string;             // ISO，默认 +7d
  platform?: "vercel" | "cloudflare" | "netlify" | "unknown";
  findings: Finding[];           // 已排序：blocker → warning → pass
  priorityFixIds: string[];      // 最多 3 个，供首屏「先修这些」
  meta: {
    durationMs: number;
    checksRun: number;
  };
}
```

---

## 3. API 契约

### 3.1 `POST /api/scan`

**Request**

```http
POST /api/scan
Content-Type: application/json

{
  "url": "https://example.com",
  "stack": ["nextjs", "vercel"],
  "focus": "security_headers"
}
```

**行为**

1. 规范化 URL（见 §4）  
2. 限流（§8）  
3. SSRF 校验（§5）  
4. 拉取目标（§6）  
5. 跑规则 → 评分 → 排序  
6. 持久化报告（§7）  
7. 返回 `ScanResult`  

**Response 200**

```json
{
  "id": "r_ab12cd34",
  "clearance": "no_go",
  "score": 61,
  "urlInput": "https://example.com",
  "urlFinal": "https://www.example.com/",
  "scannedAt": "2026-08-06T00:00:00.000Z",
  "expiresAt": "2026-08-13T00:00:00.000Z",
  "platform": "vercel",
  "findings": [],
  "priorityFixIds": ["noindex", "robots_txt"],
  "meta": { "durationMs": 1840, "checksRun": 10 },
  "reportUrl": "https://your.site/report/r_ab12cd34"
}
```

**Error**

| HTTP | code | 何时 |
|------|------|------|
| 400 | `invalid_url` | 无法解析 / 非 http(s) |
| 400 | `ssrf_blocked` | 私网、metadata 等 |
| 429 | `rate_limited` | 超限 |
| 502 | `fetch_failed` | 目标不可达/超时/非 2xx 且无法继续 |
| 504 | `scan_timeout` | 整体超时 |

```json
{ "error": { "code": "ssrf_blocked", "message": "URL is not allowed." } }
```

**开放问题默认（V1）：**  
- 允许用户输入 `http://`：自动改探 `https://`；若 HTTPS 失败再报错（或标 Blocker `https_redirect`）。  
- 报告：**有链接者可查看**（不索引 `/report/*` 列表；单页可 `noindex` 可选，V1 建议报告页 `noindex` 防垃圾站刷 SEO）。

### 3.2 `GET /api/report/[id]`（可选）

- 200：返回存储的 `ScanResult`  
- 404：不存在或过期  

页面 `/report/[id]` 优先服务端直读 store，不一定暴露 JSON API。

### 3.3 `POST /api/email-report`（M2）

```json
{
  "reportId": "r_ab12cd34",
  "email": "dev@example.com",
  "optInTips": true
}
```

- 校验报告未过期  
- 发送摘要 + 链接  
- `optInTips` 写入邮件列表提供商（双确认若服务商要求）  
- 429 / 400 同扫描限流思路  

---

## 4. URL 规范化

1. `trim`；无 scheme 时默认加 `https://`  
2. 仅允许 `http:` / `https:`  
3. 去掉 `#fragment`  
4. 拒绝凭据写入 URL（`user:pass@host`）  
5. host 小写；拒绝空 host  
6. 最终用于 fetch 的 URL 记为 `urlInput`；跳转后记 `urlFinal`  

---

## 5. SSRF 防护（必须上线前单测）

对**每一个**将要请求的 URL（含跳转后的每一跳）执行：

```text
1. scheme ∈ {http, https}
2. host 不是 localhost / *.local
3. DNS resolve → 得到 A/AAAA
4. 任一地址属于下列则拒绝：
   - 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
   - 169.254.0.0/16, ::1, fc00::/7, fe80::/10
   - 169.254.169.254 及常见云 metadata 主机名
5. 禁止跳转到 file: / data: / 其它 scheme
```

实现注意：

- **先解析再请求**；跟随 redirect 时对 Location 再跑全套校验  
- 不使用会自动跟跳且无法 hook 的不安全客户端而不加校验  
- 失败统一 `ssrf_blocked`，不回显内网细节  

伪代码位置：`lib/scan/ssrf.ts` → `assertSafeUrl(url): Promise<URL>`

---

## 6. 目标拉取（`fetch-target`）

| 参数 | V1 值 |
|------|--------|
| 整体 deadline | 8000ms |
| 单请求 timeout | 5000ms |
| 最大跳转 | 5 |
| 首页 body | 最多读取 512KB，超出截断再 parse |
| robots/sitemap | 仅 GET 小文件，上限 256KB |
| UA | `GoLiveClearanceBot/1.0 (+https://YOUR_DOMAIN/methodology)` |

### 6.1 请求集合

对同一 origin 顺序或有限并发（建议总并发 ≤ 3）：

| 资源 | 用途 |
|------|------|
| 用户 URL（跟跳转） | 状态、响应头、HTML、证书信息（若运行时可得） |
| `{origin}/robots.txt` | robots 规则 |
| sitemap URL | robots 内声明或默认 `/sitemap.xml` |
| og:image URL（若有） | HEAD/GET 查是否 2xx（注意再走 SSRF） |
| favicon 候选 | `/favicon.ico` 或 HTML link |

TLS：Node/`fetch` 若无法方便读证书过期时间，V1 可将 `tls_cert` 降为：HTTPS 握手成功即 Pass，无法读到期日则 `info`「未深度校验证书链」——**不可因此误报 Blocker**。若后续用自定义 agent 读到 `validTo`，再启用过期 Blocker。

### 6.2 平台指纹（P1）

根据响应头启发式：

| 信号 | platform |
|------|----------|
| `x-vercel-id` / `x-vercel-cache` | vercel |
| `cf-ray` | cloudflare |
| `x-nf-request-id` | netlify |
| 其它 | unknown |

---

## 7. 报告存储

### 7.1 首选：KV

```ts
key: report:{id}
value: ScanResult JSON
TTL: 7 days
```

`id`：`r_` + 8–12 位 url-safe 随机串（不可枚举过弱；勿用自增）。

### 7.2 降级（无 KV 时）

M1 可先：

- 扫描响应直接返回完整 `ScanResult`  
- `id` 仍生成；`/report/[id]` 用 **签名 payload**（HMAC）放在查询参数或短时 cookie——或  
- 仅客户端 sessionStorage 展示 + 「复制 Markdown 报告」（弱分享）  

**Ship 目标仍是：** 可分享链接 7 日有效（PRD）。上线前应接上 KV/等价存储。

访问控制 V1：**持有链接即可读**（security through unguessable id）。报告页加 `robots: noindex`。

---

## 8. 限流与缓存

分层限流（防滥用画像，不按「总点击次数」误伤自测）：

| 维度 | 默认 |
|------|------|
| 开发环境 | `NODE_ENV !== production` 或 `RATE_LIMIT_DISABLED=1` → 不限流 |
| 并发 | 每 IP 同时最多 2 个扫描 |
| 突发 | 未命中缓存的请求：10 次 / 分钟 / IP |
| 独立域名 | 每 IP 每小时最多 20 个不同 hostname；同 host 可反复扫 |
| 缓存 | 同 URL+IP 缓存 3 分钟；命中不计配额 |
| 不计配额 | `invalid_url` / `ssrf_blocked`（限流前已返回）；缓存命中 |
| 邮件 | 5 次 / 小时 / IP（M2） |

实现：内存 Map（单实例够用）或 Upstash Redis。Vercel 多实例下内存限流不完美，V1 可接受；滥用明显再加 Redis/验证码。

---

## 9. 规则引擎与评分

### 9.1 严重级别定义

| Severity | 含义 | 对 clearance |
|----------|------|----------------|
| `blocker` | 上线会明显出事 | 任一 → `no_go` |
| `warning` | 应修，可不挡上线叙事 | 不影响 Go（但首屏可提示） |
| `pass` | 通过 | — |
| `info` | 信息/局限说明 | — |

### 9.2 检查规格

| CheckId | Blocker 条件 | Warning 条件 | Pass |
|---------|--------------|--------------|------|
| `https_redirect` | 最终非 https；或证书握手失败 | http 可访问且未跳 https | 最终 https |
| `tls_cert` | **仅当**可读且已过期 | 7 日内到期 | 有效 |
| `security_headers` | —（V1 不因缺头 No-Go） | 缺 HSTS/CSP/XFO/XCTO/Referrer-Policy/Permissions-Policy 中任一项 | 六项都有（CSP 有即可，不解析完美） |
| `robots_txt` | 存在且对 `*` 或 Googlebot 等效整站 `Disallow: /` | 缺少 robots.txt | 存在且未整站禁止 |
| `sitemap` | — | 找不到可用 sitemap | 2xx |
| `noindex` | 首页 meta robots 或 `X-Robots-Tag` 含 noindex | — | 可索引 |
| `title_description` | — | 缺 title；或缺 description；或 title 长度明显异常（&lt;3 或 &gt;70） | 二者合理 |
| `canonical` | — | 缺失或非绝对 URL | 绝对 canonical |
| `open_graph` | — | 缺 og:title 或 og:image；或 image 不可访问 | 基本字段可用 |
| `favicon` | — | 找不到 | 找到 |

**security_headers 子 Finding：** 每个缺失头一条 `warning`，`id` 如 `security_headers.csp`。

### 9.3 评分（百分制，从属）

粗算即可，避免过度工程：

```text
base = 100
每个 blocker: -25（下限 0）
每个 warning: -5（同类头缺失可合并扣分上限，如 security 最多 -20）
clearance = any(blocker) ? no_go : go
```

UI **必须先展示 clearance**，分数小号展示。

### 9.4 `priorityFixIds`

取 `findings` 中 severity 最高的最多 3 条（blocker 优先，再 warning），供首屏「Fix these first」。

### 9.5 Copy fix 库（`lib/scan/fixes.ts`）

按 `finding.id` + `platform` + `stack` 选择模板。V1 至少覆盖：

- robots 整站 disallow → `app/robots.ts` 示例  
- noindex → 检查 `metadata.robots` / 移除 meta  
- 安全头 → `next.config.js` `headers()`  
- sitemap → `app/sitemap.ts`  
- OG → `metadata.openGraph`  

无匹配时给通用文字修法（无 code）。

---

## 10. 前端页面契约

### 10.1 首页 / 落地页扫描器

1. URL input + Scan 按钮  
2. Loading：明确「Checking launch readiness…」（&lt;10s 体感）  
3. 结果区结构（固定顺序）：  
   - `ClearanceBadge`（Go / Don’t ship）  
   - 「Fix these first」（≤3）  
   - `FindingList`（blocker → warning → pass 可折叠）  
   - Share link + Email CTA  
   - 联盟位在结论与列表**之后**，不遮挡  

落地页可通过 `focus` 将对应 finding 自动展开并滚动。

### 10.2 `/report/[id]`

- 只读同一套结果组件  
- 显示 `urlFinal`、`scannedAt`、过期说明  
- 提供「Re-scan」回首页并预填 URL  
- `noindex`（V1）  

### 10.3 SEO 落地页

- 静态生成；内嵌同一 `ScanForm`  
- title/description/canonical 按关键词独立  
- 内链到 methodology 与相关 slug  

---

## 11. 分析事件

| 事件 | 参数 |
|------|------|
| `scan_started` | focus?, stack? |
| `scan_completed` | clearance, score, durationMs |
| `scan_failed` | code |
| `fix_copied` | findingId |
| `report_shared` | reportId |
| `email_submitted` | optInTips |
| `affiliate_click` | partner, findingId? |

---

## 12. 测试计划（V1）

### 12.1 单测（必做）

- SSRF：localhost、内网 IP、metadata、跳转进内网  
- robots：整站 Disallow 判定  
- noindex：meta 与 header  
- score / clearance：混合 findings  

### 12.2 手工验收（对照 PRD §4.2）

用已知站点各扫一次：

- 故意 noindex 的预览站 → 必 No-Go  
- 正规生产站 → 多半 Go + 若干 warning  
- 超时/无效域名 → 友好错误，无堆栈泄露  

---

## 13. 配置清单

见 [DEPLOYMENT.md](./DEPLOYMENT.md) §3.5。Tech Spec 补充：

| 变量 | 示例 |
|------|------|
| `REPORT_TTL_SECONDS` | `604800` |
| `SCAN_CACHE_SECONDS` | `120` |
| `RATE_LIMIT_PER_MINUTE` | `10` |
| `REPORT_SIGNING_SECRET` | 降级签名模式时用 |
| `AFFILIATE_*` | M2 |

---

## 14. 实现里程碑映射

| 里程碑 | Tech 交付物 |
|--------|-------------|
| M1 | `ssrf` + `fetch-target` + P0 rules + `POST /api/scan` + 首页结果 UI + report 存储与 `/report/[id]` + 限流 |
| M2 | email API、GA 事件、methodology、1 条联盟、platform fingerprint |
| M3 | 8 落地页 + focus 高亮 + 内链 |
| M4 | 规则误报治理、缓存调参、按需 Upstash |

---

## 15. 非目标（实现禁止事项）

- 浏览器端直接扫目标站当主路径  
- 无 SSRF 的开放式 proxy  
- Playwright/Lighthouse 进 V1 主路径  
- 为凑检查数而爬全站  
- 在 Blocker 文案里只写字段名不写事故后果  

---

## 16. 待决与本 Spec 默认值

| PRD 开放问题 | Tech Spec 默认（可改） |
|--------------|------------------------|
| 产品名/域名 | 代码用占位 `YOUR_DOMAIN`；品牌字符串集中 `lib/site.ts` |
| 主联盟 | 接口留 `affiliates.ts`；内容 M2 再填 |
| 报告可见性 | 有链接可看 + 报告页 noindex |
| HTTP 输入 | 允许，优先升级为 HTTPS 探测 |

---

**批准后进入开发：** 按 §14 M1 顺序开工；UI 合并前以 PRD §4.2 走查为门禁。
