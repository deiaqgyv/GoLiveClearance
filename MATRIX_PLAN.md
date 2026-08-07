---
AIGC:
  ContentProducer: '001191110102MAD55U9H0F10002'
  ContentPropagator: '001191110102MAD55U9H0F10002'
  Label: '1'
  ProduceID: 'da8edd83-b1a3-443f-928d-568b9e3c03eb'
  PropagateID: 'da8edd83-b1a3-443f-928d-568b9e3c03eb'
  ReservedCode1: '7a2c329a-1463-4185-a688-8af351b885de'
  ReservedCode2: '7a2c329a-1463-4185-a688-8af351b885de'
---

# 流量站矩阵方案

> 基于现有 Go-Live Clearance 扫描引擎能力，设计同类型工具矩阵，扩大 SEO 流量覆盖面。

---

## 一、现状总结

### 1.1 已有资产

| 资产 | 说明 |
|------|------|
| 主站 | goliveclearance.com（已部署 Vercel） |
| 扫描引擎 | `run-scan.ts`（782 行），17 个检查项，无外部依赖 |
| 着陆页 | 15 个（8 工具意图页 + 7 场景叙事页） |
| 测试 | 169 个测试全部通过 |
| 报告系统 | 内存 Map + HMAC 签名 token，URL 自包含 |
| 评分系统 | 三态 go/hold/no_go，blocker -25 / warning -5 |

### 1.2 引擎能力清单（可拆分为独立工具的原子能力）

| # | 能力 | 当前角色 | 可拆分方向 |
|---|------|---------|-----------|
| 1 | HTTPS 检测 | Blocker | SSL/HTTPS Checker（已有页面，可独立站） |
| 2 | noindex 检测 | Blocker | Noindex Checker（已有页面） |
| 3 | robots.txt Disallow 检测 | Blocker | Robots.txt Checker（已有页面） |
| 4 | 预览域名泄露检测 | Blocker | **Preview Domain Detector**（独家能力，无竞品） |
| 5 | 安全头检测（6 项） | Warning | Security Headers Checker（已有页面） |
| 6 | Title 长度检测 | Warning | **Title Tag Check** |
| 7 | Meta Description 长度 | Warning | **Meta Description Check** |
| 8 | H1 存在性 | Warning | **H1 Tag Checker** |
| 9 | Canonical 检测 | Warning | **Canonical URL Validator** |
| 10 | Open Graph 检测 | Warning | Open Graph Checker（已有页面） |
| 11 | Favicon 检测 | Warning | **Favicon Checker** |
| 12 | 占位文本检测 | Warning | **Placeholder Text Detector** |
| 13 | Analytics 检测（18 种） | Warning | **Analytics Detector** |
| 14 | 信任页面检测 | Warning | **Trust Pages Checker** |
| 15 | Sitemap 可达性 | Warning | Sitemap Checker（已有页面） |
| 16 | 平台检测（Vercel/Netlify 等） | 信息 | — |
| 17 | 重定向链追踪 | 内部能力 | **Redirect Chain Checker** |

---

## 二、矩阵策略选择

### 2.1 四种方案对比

| 方案 | 描述 | 流量天花板 | 开发成本 | 维护成本 | SEO 风险 |
|------|------|-----------|---------|---------|---------|
| **A. 同域新路径** | 在 goliveclearance.com 下新增工具页 | 中 | 低 | 低 | 低 |
| **B. 多域名站群** | 每个工具独立域名 | 高 | 高 | 高 | 中 |
| **C. 共享引擎 + 多域名** | 引擎复用，前端独立部署 | 高 | 中 | 中 | 中 |
| **D. AI 批量站群** | 程序化生成大量内容页 | 极高 | 中 | 高 | 高 |

### 2.2 选定路线：A → C 渐进式

```
Phase 1（现在）: 方案 A — 同域深耕，补充现有 15 页未覆盖的工具页
    ↓
Phase 2（1-2 个月后）: 方案 C — 挑出流量潜力最大的 3-5 个工具，独立域名
    ↓
Phase 3（3-6 个月后）: 方案 C 扩展 — 形成工具矩阵网络，站间交叉引流
```

**选择理由：**
- 方案 A 成本最低、风险最小，先把同域内容做透
- 方案 C 兼顾流量天花板和开发成本：引擎已写好，拆分只需复用
- 跳过 B：多域名但各自从零开发太浪费引擎资产
- 跳过 D：AI 批量内容容易被 Google 判定为低质量，风险不可控

---

## 三、工具矩阵蓝图

### Phase 1：同域新工具页（goliveclearance.com/new-path）

> 目标：把引擎已有但还没着陆页的能力补齐，用现有组件 `tool-landing.tsx` 快速上线。

#### P1-A：高优先级（1 周内上线）

| 工具路径 | 对应引擎能力 | 目标关键词 | 月搜索量（估） | 竞争度 |
|---------|------------|-----------|-------------|--------|
| `/title-tag-checker` | Title 长度检测 | "title tag checker" | 8,000 | 中 |
| `/canonical-checker` | Canonical 检测 | "canonical tag checker" | 3,500 | 低 |
| `/h1-tag-checker` | H1 存在性 | "h1 tag checker" | 2,000 | 低 |
| `/meta-description-checker` | Meta Description | "meta description checker" | 5,000 | 中 |
| `/favicon-checker` | Favicon 检测 | "favicon checker" | 4,000 | 低 |

#### P1-B：中优先级（2 周内上线）

| 工具路径 | 对应引擎能力 | 目标关键词 | 月搜索量（估） | 竞争度 |
|---------|------------|-----------|-------------|--------|
| `/redirect-chain-checker` | 重定向链追踪 | "redirect chain checker" | 6,000 | 中 |
| `/analytics-detector` | Analytics 检测 | "what analytics does this site use" | 2,500 | 低 |
| `/placeholder-text-checker` | 占位文本检测 | "lorem ipsum detector" | 800 | 极低 |
| `/trust-pages-checker` | 信任页面检测 | "website trust check" | 1,500 | 低 |

#### P1-C：独家能力页（差异化竞争）

| 工具路径 | 独家卖点 | 目标关键词 |
|---------|---------|-----------|
| `/preview-domain-detector` | 检测是否泄露预览域名（13 种后缀） | "staging domain leaked" / "vercel preview indexed" |
| `/go-no-go-checker` | 唯一做 Go/No-Go 综合判断的工具 | "website go live check" / "launch readiness check" |

**Phase 1 新增页面数：11 页**（总页面数从 15 → 26）

---

### Phase 2：独立域名工具站（1-2 个月后启动）

> 目标：从 Phase 1 表现最好的工具中挑 3-5 个，独立建站，获取独立域名权重。

#### 候选独立站

| 域名（示例） | 核心工具 | 引擎复用 | 差异化 |
|-------------|---------|---------|--------|
| `securityheaders.io` | 安全头深度检测 | 安全头检查逻辑 | 更细粒度（逐个 header 打分 + 修复指引） |
| `redirectchecker.io` | 重定向链分析 | fetch-target.ts 重定向追踪 | 可视化跳转链 + HTTP 状态码时间线 |
| `canonicalvalidator.com` | Canonical URL 验证 | Canonical 检测逻辑 | 跨页面 canonical 一致性检查 |
| `ogchecker.com` | Open Graph 预览 | OG 检测逻辑 | 实时预览 Facebook/Twitter/LinkedIn 分享卡 |
| `analyticsdetector.com` | 分析工具检测 | Analytics 检测逻辑 | 检测 18+ 种分析工具 + 版本识别 |

#### 技术复用方式

```
packages/scan-engine/          ← 从主站抽出为独立 npm 包（内部）
  ├── ssrf.ts
  ├── fetch-target.ts
  ├── parse-html.ts
  ├── launch-signals.ts
  ├── score.ts
  ├── fixes.ts
  └── run-scan.ts

sites/goliveclearance/         ← 主站（现有）
sites/securityheaders/         ← 独立站 A
sites/redirectchecker/         ← 独立站 B
sites/ogchecker/               ← 独立站 C
```

每个独立站：
- 复用 `packages/scan-engine` 核心逻辑
- 独立前端 UI（针对单一工具深度优化 UX）
- 独立域名 + 独立 Vercel 项目
- 底部交叉链接回主站"完整 Go/No-Go 检查"

---

### Phase 3：矩阵网络（3-6 个月后）

> 目标：形成工具站网络，站间交叉引流，建立品牌矩阵。

#### 矩阵结构

```
                    goliveclearance.com
                   （旗舰站 - Go/No-Go 综合体）
                    /        |        \
                   /         |         \
    securityheaders.io  redirectchecker.io  ogchecker.com
      （单项深度站）      （单项深度站）    （单项深度站）
         |                  |                 |
    [交叉引流]          [交叉引流]         [交叉引流]
         \                 |                /
          \                |               /
           → 共享 scan-engine + 统一分析后台
```

#### 引流策略
- 每个独立站免费版给出基础结果 + "查看完整 17 项检查"链接回主站
- 主站每个单项检查页放独立站的"深度分析"入口
- 统一报告格式，跨站可共享 report token

---

## 四、技术架构

### 4.1 引擎复用设计

现有引擎已经是模块化的，拆分为独立包只需：

```
当前结构:
goliveclearance/src/lib/scan/
  ├── ssrf.ts
  ├── fetch-target.ts
  ├── parse-html.ts
  ├── launch-signals.ts
  ├── score.ts
  ├── fixes.ts
  ├── run-scan.ts
  └── types.ts

目标结构（Phase 2）:
packages/scan-engine/
  └── src/   ← 直接迁移上述文件
  
sites/goliveclearance/src/lib/scan/ → import from '@glc/scan-engine'
sites/securityheaders/src/lib/scan/ → import from '@glc/scan-engine'
```

**无需重写引擎代码**——现有模块已经是无副作用纯函数，迁移成本极低。

### 4.2 新增检查能力扩展路线

为支撑 Phase 2 的深度工具站，需要补充以下检查能力：

| 新能力 | 优先级 | 依赖 | 工作量 | 目标站 |
|-------|--------|------|--------|-------|
| 结构化数据 (JSON-LD) 检测 | P1 | HTML 解析 | 2 天 | — / Phase 3 |
| 死链检测 (Broken Link) | P2 | 批量 HTTP 请求 | 3-5 天 | brokenlinks 站 |
| Core Web Vitals | P3 | Lighthouse API / CrUX | 3 天 | cwv-checker 站 |
| 多 URL Canonical 一致性 | P2 | 批量抓取 | 2 天 | canonicalvalidator 站 |
| HTTP 状态码时间线 | P1 | fetch-target.ts 增强 | 1 天 | redirectchecker 站 |
| 安全头逐项打分 | P1 | score.ts 增强 | 1 天 | securityheaders 站 |

### 4.3 报告系统扩展

当前报告系统是内存 Map，单实例部署。Phase 2 多站后：

| 阶段 | 方案 | 成本 |
|------|------|------|
| Phase 1 | 维持内存 Map（够用） | $0 |
| Phase 2 | Vercel KV（免费额度 256MB） | $0 |
| Phase 3 | Upstash Redis（按量付费） | <$5/月 |

---

## 五、SEO 流量获取策略

### 5.1 关键词矩阵

```
                    高搜索量
                       |
        title tag      |   redirect chain
        checker (8K)   |   checker (6K)
                       |
        meta desc      |   security headers
        checker (5K)   |   checker (12K+)
                       |
  ------- 低竞争 -------+-------- 高竞争 -------
                       |
        favicon        |   og checker
        checker (4K)   |   (5K, 竞争激烈)
                       |
        canonical      |   robots.txt
        checker (3.5K) |   checker (9K)
                       |
        h1 checker     |
        (2K)           |
                    低搜索量
```

**策略：** 先吃左下角（低竞争 + 中低搜索量），快速获取初始流量和域名权重，再冲击右上角。

### 5.2 内容策略

| 内容类型 | Phase 1 | Phase 2 | 说明 |
|---------|---------|---------|------|
| 工具页 | 11 页新增 | 每站 1 核心页 | 即用即走，转化靠 UX |
| 操作指南 | 每工具 1 篇 | 每站 3-5 篇 | "How to check X" 长尾 |
| 问题排查 | 每工具 1 篇 | 每站 5-10 篇 | "Why my X is not working" |
| 对比页 | — | 每站 1 篇 | "X vs Competitor" |
| 案例研究 | — | 每站 2-3 篇 | 真实修复案例 |

### 5.3 技术SEO要点

- **每个工具站独立 sitemap.xml**，单独提交 Search Console
- **结构化数据**：每个工具页加 `SoftwareApplication` schema
- **内链**：Phase 1 工具页之间互相链接（"Related checks"区块）
- **页面速度**：单项工具页比综合体更快（检查项少），作为独立站的天然优势
- **hreflang**：Phase 3 多站间用 hreflang 标注关系

---

## 六、优先级与执行路线图

### 第 1 周：Phase 1-A 高优先级工具页

```
Day 1-2: 创建 5 个工具页（title/canonical/h1/meta-desc/favicon）
         → 复用 tool-landing.tsx 模板，注册 tool-routes.ts
Day 3:   更新 sitemap，部署上线
Day 4-5: Search Console 提交新 sitemap
Day 6-7: 监控收录情况
```

### 第 2-3 周：Phase 1-B 中优先级 + 独家页

```
Week 2:  创建 4 个中等优先级工具页（redirect/analytics/placeholder/trust）
Week 3:  创建 2 个独家能力页（preview-domain / go-no-go）
         更新首页工具列表，增加内链
         全量测试 + 部署
```

### 第 4-6 周：观察期 + 引擎包化

```
Week 4-5: 监控 Search Console 数据，确认收录和展示
Week 6:   将 scan-engine 抽为独立 packages/
         验证主站功能不受影响
         为 Phase 2 做技术准备
```

### 第 2-3 个月：Phase 2 首批独立站

```
Month 2: 选定 3 个流量最高的工具方向
         注册域名 × 3
         基于共享引擎搭建独立站
         各站上线 + 提交 Search Console
Month 3: 独立站内容补充（操作指南 + 问题排查）
         站间交叉链接部署
         监控各站独立流量
```

---

## 七、风险与注意事项

### 7.1 SEO 风险

| 风险 | 概率 | 影响 | 对策 |
|------|------|------|------|
| Google 判定站群为操 manipulative | 中 | 高 | 独立站要有独立品牌名 + 独立 UI，不共用模板 |
| 同域页面相似度过高被判 thin content | 低 | 中 | 每个工具页增加独特内容（操作指南 + 案例） |
| 独立站初期无权重，排名慢 | 高 | 中 | 选低竞争关键词切入，耐心等 3-6 个月 |
| 多站分散精力，每个站都做不好 | 中 | 高 | Phase 2 一次最多 3 个站，不贪多 |

### 7.2 技术风险

| 风险 | 对策 |
|------|------|
| 引擎包化后主站出 bug | 抽包前先跑完整 169 个测试，抽包后重跑 |
| 多站报告系统不统一 | Phase 2 统一迁移到 Vercel KV |
| 独立站维护成本超预期 | 每站保持极简架构（1 页 + API），不引入复杂度 |

### 7.3 关键决策点

1. **Phase 2 启动时机**：等 Phase 1 的 11 个新页面有 Search Console 展示数据后再决定。如果 Phase 1 流量增长明显，加大 Phase 2 投入；如果不明显，先优化 Phase 1 内容再扩。

2. **独立站数量上限**：建议不超过 5 个。超过后维护成本指数级上升，且站群风险增加。

3. **是否要做中文站**：当前所有内容都是英文。如果考虑中文市场可作为 Phase 3 选项，但英文市场搜索量更大、CPM 更高，优先英文。

---

## 八、Phase 1 立即行动项

以下 5 个动作可以**本周内立即执行**：

### Action 1：创建 5 个高优先级工具页

用现有 `tool-landing.tsx` 模板创建：
- `/title-tag-checker`
- `/canonical-checker`
- `/h1-tag-checker`
- `/meta-description-checker`
- `/favicon-checker`

### Action 2：更新 tool-routes.ts

注册上述 5 个新路由，设置 priority。

> AI生成