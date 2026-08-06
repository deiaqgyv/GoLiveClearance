# PRD：Go-Live Site Clearance（上线体检报告站）

| 字段 | 内容 |
|------|------|
| 状态 | Draft v0.2 |
| 日期 | 2026-08-06 |
| 类型 | 英文 Google 流量站 · 工具产品 |
| 约束 | 低预算、无存量域名/内容/名单；优先免费托管 |

---

## 1. 一句话

面向独立开发者与小团队：粘贴即将上线或刚上线的公开网址，约 30 秒内给出 **Go / No-Go 体检报告**（安全、索引、基础 SEO、社交预览），并提供可执行修复建议。

**对外定位句（EN）：**  
*Paste your URL. Get a ship / don’t-ship clearance — with the exact Next.js fixes, not another checklist.*

**品类定位：** 不是又一个网站检测器，而是 **上线前的清关条（clearance）**。

---

## 2. 问题与机会

**问题：** 上线前常见事故（`Disallow: /`、staging `noindex`、缺安全头、无 OG image）靠人工清单易漏；纯 checklist 文章可被 AI 摘要替代，回访弱。

**机会：** 「URL 进 → 分数/报告出」已被 securityheaders 等验证（公开估算约数十万月访、高直接访问）。垂直到 Indie / Next.js / SaaS go-live，避开企业级全站审计红海。

**不做的事：** 不做 Semrush 式 SEO 套件；不做 340+ 重扫描；不做纯内容站。

---

## 3. 目标用户

| 角色 | 场景 | 成功时刻 |
|------|------|----------|
| Indie / 小团队开发 | 首次或再次上线前 | 3 分钟内知道有没有 Blocker |
| 兼职全栈 | Vercel / Next 部署后自检 | 拿到可分享报告发给搭档 |
| 技术向创始人 | Product Hunt / 付费推广前 | 确认索引与社交预览可用 |

非目标：需要整站爬虫、竞品关键词、团队工作流的代理商企业客户（可后期再做）。

---

## 4. 差异化与用户感知

差异不靠「检查项更多」，靠用完后的感觉：  
**「我刚才差点带着隐患上线，现在知道先修哪三件事。」**

### 4.1 与常见竞品的体验差

| 别人常见体验 | 我们要给的体验 |
|--------------|----------------|
| securityheaders：只告诉你「头是 B」 | 告诉你：**今天能不能上线**（Go / No-Go） |
| 长文 checklist：自己勾、容易漏 | **自动扫完**；人工清单只补机器扫不到的 |
| Launch Auditor：重、像企业工具 | **30 秒、免费、一个人就能用的清关条** |
| 通用审计：术语堆砌 | **按 Next / Vercel 说话**，直接给可粘贴配置 |

### 4.2 五个「有帮助」瞬间（体验验收）

实现与文案必须以这些瞬间为准；缺任一则产品差异感不足。

| # | 瞬间 | 用户应有的感觉 | 产品要求 |
|---|------|----------------|----------|
| 1 | 约 10 秒内有结论 | 不被细节淹没 | 首屏大字 **Go / No-Go**，先于分项列表 |
| 2 | 怕的错被点名 | 「你懂真实事故」 | Blocker 用事故语言（例：首页还在 noindex → 上线等于搜不到） |
| 3 | 下一步只有 1–3 件 | 被减负，不是被吓住 | 默认：**先修 Blocker；其余可上线后再做** |
| 4 | 修法能直接用 | 像在编辑器旁边 | 每条失败带 **Copy fix**（Next/`next.config`/Vercel 优先） |
| 5 | 报告能丢给别人 | 省一次解释 | `/report/[id]` 像检测证明，不像后台表格 |

用户应记住的不是分数，而是：  
*「差一点就带着 noindex 上线了。」*  
这种「被救过一回」的感觉，驱动收藏、复用与分享。

### 4.3 语气规范

| 少用 | 多用 |
|------|------|
| Score 72 / Grade C / Improve your SEO | Ship / Don’t ship / Blocker / Fix in 5 minutes |
| 建议优化 47 项 | 先修这 3 个 Blocker |
| 空泛的「best practices」 | 会发生什么 + 怎么改 |

### 4.4 必须做实的差异（禁止只写在营销文案里）

1. 报告首屏 = **清关章**（Go/No-Go），不是仪表盘墙  
2. Blocker 用**事故后果**书写，不只写缺失字段名  
3. 每条失败提供 **Copy fix**（栈向示例）  
4. 结果排序：**Blocker → Warning → Pass**  
5. 分享页视觉与信息结构接近「清关证明」，而非数据表格后台  

---

## 5. 产品原则

1. **工具是产品，文章是入口** — 每页必须能跑同一次扫描。  
2. **少而准** — Blocker 误报成本高于少查几项。  
3. **清关感优先于分数感** — No-Go/Go 叙事压过百分制（见 §4）。  
4. **可分享报告** — 沉淀直接访问与自然外链。  
5. **修法可复制** — 优先 Next.js / Vercel 示例。  
6. **克制变现** — 结果页按失败项推荐，不挡报告、不挡清关结论。  

---

## 6. 范围

### 6.1 V1 必须有（P0）

**核心流程**

1. 用户输入公开 `https://` URL  
2. 服务端安全拉取并检测（见下表）  
3. 输出总分 + Go/No-Go + 分项红/黄/绿  
4. 生成可分享报告页 `/report/[id]`  
5. 可选：Email me this report  

**自动检测项**

| 检查 | 通过标准（摘要） |
|------|------------------|
| HTTPS / 跳转 | 最终以 HTTPS 提供；HTTP 应跳转 |
| 安全头 | 评估 HSTS、CSP、X-Frame-Options、X-Content-Type-Options、Referrer-Policy、Permissions-Policy |
| robots.txt | 存在；不得对整站 `Disallow: /`（误拦） |
| sitemap | `/sitemap.xml`（或 robots 声明的地址）可访问 |
| noindex | 首页 HTML 与 `X-Robots-Tag` 无生产 noindex |
| title / description | 存在且长度合理 |
| canonical | 存在且为绝对 URL |
| Open Graph | `og:title`；`og:image` 可访问 |
| favicon | 可解析到有效图标 |
| 证书 | 未过期（能取到则查） |

**评分**

- 任一 **Blocker**（整站 Disallow、首页 noindex、无 HTTPS、证书失效）→ 报告章为 **No-Go**  
- 其余缺失 → Warning；通过 → Pass  
- 展示简易总分（百分制），但 No-Go 优先于分数叙事（清关感优先，见 §4）  
- 结果区须满足 §4.2：首屏结论、事故语言、1–3 优先修复、Copy fix、可分享证明感  

**配套页面（内容入口）**

- 先发 8 页：6 个工具意图页 + `nextjs-production-checklist` + `website-launch-checklist`  
- 再扩至 15 页（见附录 A）  
- 另需：`/about`、`/methodology`

**埋点与运营基座**

- GA4、Google Search Console  
- 扫描次数、完成率、邮件订阅、联盟点击  

### 6.2 V1 应有（P1，可同迭代）

- 平台指纹（Vercel / Cloudflare / Netlify）→ 报告内给对应修法  
- 用户勾选栈（Next.js / Stripe / Auth）→ 追加少量**人工清单**（非爬虫）  
- 结果页按失败类挂 1–2 条联盟推荐  

### 6.3 V1 明确不做

整站多页爬取、Lighthouse/CWV、无障碍全量、外链/关键词/DA、账号体系与团队协作、扫描 localhost/内网、与 Launch Auditor 比拼检查数量。

---

## 7. 用户故事（V1）

1. 作为开发者，我粘贴生产 URL，希望在 30 秒内看到是否能上线（Go/No-Go）。  
2. 作为开发者，我希望每条失败都告诉我「现状 / 为何重要 / 怎么改」（最好有 Next 配置片段）。  
3. 作为开发者，我希望把报告链接发给同事，无需对方再扫一次。  
4. 作为从 Google 来的访客，我希望落地页直接提供扫描器，而不是先读完长文。  
5. 作为站长，我希望「Email me this report」后能收到完整结果，并可选加入更新提示。

---

## 8. 成功标准

### 8.1 上线门槛（Ship）

- [ ] P0 检测可在公开站点上稳定跑通  
- [ ] SSRF 防护：拒绝私网 / metadata IP；仅 http(s)；超时与跳转上限  
- [ ] IP 速率限制生效  
- [ ] 报告可分享且 7 日内可打开  
- [ ] 首页 + ≥1 落地页可索引；已接 GSC/GA  
- [ ] 移动端可完成完整扫描流程  
- [ ] 报告体验通过 §4.2 五个「有帮助」瞬间的人工走查  

### 8.2 90 天北星（Validate）

| 指标 | 目标（务实） |
|------|----------------|
| Search Console | 持续有展现与点击 |
| 产品 | 周扫描次数稳定上升；非一次性好奇流量占一定比例 |
| 名单 | 邮件订阅从 0 起步持续增长 |
| 变现 | 至少跑通 1 次联盟点击或注册 |
| 质量 | Blocker 类明显误报可接受地低（人工抽检） |

未达：展现长期接近 0、工具无人用、或变现路径完全不通 → 收窄关键词或调整检测叙事，再决定是否换题。

---

## 9. 技术约束（摘要）

| 项 | 决策 |
|----|------|
| 形态 | Next.js；Vercel 或 Cloudflare 免费/低配 |
| 扫描 | **必须服务端**代请求（浏览器跨域读不全头） |
| 存储 | 报告短 id + KV/免费 DB；或等价方案 |
| 邮件 | Resend / Brevo 免费档 |
| 成本 | 优先 $0 托管；付费项主要是域名 |
| 安全 | 限流、超时（约 3–8s）、跳转次数上限、不持久化完整 HTML 过久 |
| 部署 | **GitHub（代码）→ Vercel（运行）**；不用 GitHub Pages 当生产；V1 不买 VPS |

完整图示、环境变量、扫描链路与安全清单见 **[DEPLOYMENT.md](./DEPLOYMENT.md)**。  
API / 规则 / SSRF / 报告 schema 见 **[TECH_SPEC.md](./TECH_SPEC.md)**。

---

## 10. 变现与品牌

- **主：** 报告页情境化联盟（监控 / 托管 / 安全相关，先 1–2 家）  
- **辅：** 邮件列表（上线检查 tip，低频）  
- **展示广告：** V1 不作为支柱；若加不得影响报告阅读  
- **品牌：** 英文产品名待定（工作名：Go-Live Clearance / Site Launch Check）；官网首发，社媒只做摘要回流  

---

## 11. 里程碑

| 阶段 | 时间（业余） | 交付 |
|------|----------------|------|
| M0 | 本周 | PRD 冻结；域名候选 3 个；产品名 1 个 |
| M1 | 1–2 周 | 扫描 API + 首页报告 + SSRF/限流 + 分享页 |
| M2 | +1 周 | 邮件报告；GSC/GA；1 条联盟；methodology |
| M3 | +2–4 周 | 8 个优先落地页上线并提交索引 |
| M4 | 至 Day 90 | 扩至 ~15 页；按 GSC 更新/合并；评估是否做 V2（多页爬或 CWV） |

---

## 12. 风险与对策

| 风险 | 对策 |
|------|------|
| 检查项与 securityheaders 重叠 | 打包成 go-live 综合 clearance，不只卖「头」 |
| AI 摘要吃掉 checklist 文 | 工具意图页优先；文章必须内嵌扫描 |
| 免费函数被刷 | 限流 + 短缓存 + 验证码（必要时） |
| 误报伤害信任 | methodology 写清局限；Blocker 规则从严、从少 |
| 冷启动无外链 | 可分享报告 + 栈向实操内容自然引用 |

---

## 13. 开放问题（需拍板）

1. 正式英文产品名与域名（`.dev` / `.com`）  
2. 首条联盟合作方（监控 vs 托管，二选一作主）  
3. 报告默认公开还是「有链接者可看」（建议 V1：有链接可看）  
4. 是否在 V1 支持 HTTP 输入并自动规范为 HTTPS 探测  

---

## 附录 A：落地页清单（15）

**优先 8：**  
`/security-headers-checker` · `/robots-txt-checker` · `/open-graph-checker` · `/ssl-https-checker` · `/noindex-checker` · `/sitemap-checker` · `/nextjs-production-checklist` · `/website-launch-checklist`

**随后 7：**  
`/nextjs-launch-checklist` · `/vercel-go-live-checklist` · `/saas-pre-launch-checklist` · `/forgot-noindex-production` · `/missing-security-headers-nextjs` · `/disallow-all-robots-txt` · `/og-image-not-showing`

每页结构：意图说明 → 同款扫描器 → Top 失败原因 → Next/Vercel 示例 → 内链 → 邮件钩子。

---

## 附录 B：竞品边界

| 竞品 | 我们不抢什么 | 我们抢什么 | 用户感受差异 |
|------|--------------|------------|--------------|
| securityheaders.com | 纯头评分品牌词垄断 | 上线综合 Go/No-Go | 从「头几分」到「能不能上线」 |
| launch-checklist.com | 代理商人工任务流 | 自动检测 + Indie 场景 | 从「自己勾」到「机器先判」 |
| launchauditor.com | 重型 SaaS / CI 全量 | 免费、快、窄垂 SEO 入口 | 从「企业套件」到「清关条」 |
| 各类 checklist 长文 | 纯信息阅读 | 文内嵌同一扫描器 | 从「看完就走」到「扫完再走」 |

体验与文案细则见 **§4 差异化与用户感知**。

---

**批准：** 产品负责人确认开放问题后，本 PRD 视为 v1 范围冻结，进入开发（实现以 [TECH_SPEC.md](./TECH_SPEC.md) 为准）。UI/文案评审时以 §4.2 五个瞬间为验收标准。
