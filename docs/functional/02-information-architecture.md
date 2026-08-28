# 信息架构 — Go-Live Clearance

## 1. 站点地图（公开可索引）

### 核心

| 路径 | 角色 |
|------|------|
| `/` | 全量扫描首页 |
| `/report/[id]` | 报告页（**noindex**，不在 sitemap） |
| `/api/scan` | 扫描 API（disallow） |

### Focus 单检工具页（priority ~0.9）

`/title-tag-checker` · `/meta-description-checker` · `/h1-tag-checker` · `/canonical-checker` · `/noindex-checker` · `/robots-txt-checker` · `/sitemap-checker` · `/favicon-checker` · `/open-graph-checker` · `/ssl-https-checker` · `/security-headers-checker`

### 清单 / 场景页

`/website-launch-checklist` · `/nextjs-production-checklist` · `/vercel-go-live-checklist` · `/saas-pre-launch-checklist` · `/forgot-noindex-production` · `/missing-security-headers-nextjs` · `/disallow-all-robots-txt` · `/og-image-not-showing`

### Topic Hub

`/seo-checkers` · `/launch-checklists` · `/social-preview` · `/security`

### 内容 / 法务

`/methodology` · `/about` · `/contact` · `/privacy` · `/terms`

## 2. 重定向

| From | To |
|------|-----|
| `/nextjs-launch-checklist` | 301 → `/nextjs-production-checklist` |

## 3. 导航逻辑

- 工具页通过 `ToolLanding` + 面包屑 + hub 聚合互相发现
- Focus 页扫描后进报告，可「Run full clearance」回首页带 url
- Hub 页聚合同主题工具/场景链接

## 4. robots / sitemap

- `robots.ts`：allow `/`；disallow `/report/`、`/api/`
- `sitemap.ts`：首页 + TOOL_ROUTES + methodology/about + hubs + privacy/terms/contact
- `/report/*` 与遗留 checklist **不进** sitemap

## 5. Focus 与路由绑定

| focus | 路由 |
|-------|------|
| title | `/title-tag-checker` |
| description | `/meta-description-checker` |
| h1 | `/h1-tag-checker` |
| canonical | `/canonical-checker` |
| noindex | `/noindex-checker` |
| robots_txt | `/robots-txt-checker` |
| sitemap | `/sitemap-checker` |
| favicon | `/favicon-checker` |
| open_graph | `/open-graph-checker` |
| https_redirect | `/ssl-https-checker` |
| security_headers | `/security-headers-checker` |

无 focus = 全量扫描（首页与多数清单/叙事页）。
