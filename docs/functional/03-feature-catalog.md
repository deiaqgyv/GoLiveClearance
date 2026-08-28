# 功能总表 — Go-Live Clearance

| 功能 ID | 名称 | 入口 | 优先级 | 状态 | 备注 |
|---------|------|------|--------|------|------|
| `F-GL-HOME` | 全量清关扫描入口 | `/` | P0 | 已上线 | ScanForm 无 focus |
| `F-GL-API` | 扫描 API | `/api/scan` | P0 | 已上线 | POST url+focus；SSRF/限流/缓存 |
| `F-GL-REPORT` | 可分享报告 | `/report/[id]` | P0 | 已上线 | HMAC token；7 天；noindex |
| `F-GL-FOCUS-TITLE` | Title 单检 | `/title-tag-checker` | P0 | 已上线 | focus=title |
| `F-GL-FOCUS-DESC` | Meta description 单检 | `/meta-description-checker` | P0 | 已上线 | focus=description |
| `F-GL-FOCUS-H1` | H1 单检 | `/h1-tag-checker` | P0 | 已上线 | focus=h1 |
| `F-GL-FOCUS-CANON` | Canonical 单检 | `/canonical-checker` | P0 | 已上线 | focus=canonical |
| `F-GL-FOCUS-NOINDEX` | noindex 单检 | `/noindex-checker` | P0 | 已上线 | focus=noindex |
| `F-GL-FOCUS-ROBOTS` | robots.txt 单检 | `/robots-txt-checker` | P0 | 已上线 | focus=robots_txt |
| `F-GL-FOCUS-SITEMAP` | Sitemap 单检 | `/sitemap-checker` | P0 | 已上线 | focus=sitemap |
| `F-GL-FOCUS-FAVICON` | Favicon 单检 | `/favicon-checker` | P0 | 已上线 | focus=favicon |
| `F-GL-FOCUS-OG` | Open Graph 单检 | `/open-graph-checker` | P0 | 已上线 | focus=open_graph |
| `F-GL-FOCUS-HTTPS` | HTTPS/SSL 单检 | `/ssl-https-checker` | P0 | 已上线 | focus=https_redirect |
| `F-GL-FOCUS-HEADERS` | 安全头单检 | `/security-headers-checker` | P0 | 已上线 | focus=security_headers |
| `F-GL-CHECK-LAUNCH` | 通用上线清单 | `/website-launch-checklist` | P0 | 已上线 | 全量扫描 |
| `F-GL-CHECK-NEXT` | Next.js 生产清单 | `/nextjs-production-checklist` | P0 | 已上线 | 全量扫描 |
| `F-GL-CHECK-VERCEL` | Vercel go-live 清单 | `/vercel-go-live-checklist` | P1 | 已上线 | 叙事+全量 |
| `F-GL-CHECK-SAAS` | SaaS 预上线清单 | `/saas-pre-launch-checklist` | P1 | 已上线 | 叙事+全量 |
| `F-GL-STORY-NOINDEX` | 漏 noindex 叙事 | `/forgot-noindex-production` | P1 | 已上线 |  |
| `F-GL-STORY-HEADERS` | 缺安全头叙事 | `/missing-security-headers-nextjs` | P1 | 已上线 |  |
| `F-GL-STORY-DISALLOW` | Disallow:/ 叙事 | `/disallow-all-robots-txt` | P1 | 已上线 |  |
| `F-GL-STORY-OG` | OG 不显示叙事 | `/og-image-not-showing` | P1 | 已上线 |  |
| `F-GL-HUB-SEO` | SEO checkers hub | `/seo-checkers` | P1 | 已上线 |  |
| `F-GL-HUB-LAUNCH` | Launch checklists hub | `/launch-checklists` | P1 | 已上线 |  |
| `F-GL-HUB-SOCIAL` | Social preview hub | `/social-preview` | P1 | 已上线 |  |
| `F-GL-HUB-SEC` | Security hub | `/security` | P1 | 已上线 |  |
| `F-GL-METHOD` | 方法论页 | `/methodology` | P1 | 已上线 |  |
| `F-GL-ABOUT` | 关于 | `/about` | P2 | 已上线 |  |
| `F-GL-CONTACT` | 联系 | `/contact` | P2 | 已上线 |  |
| `F-GL-PRIVACY` | 隐私 | `/privacy` | P2 | 已上线 |  |
| `F-GL-TERMS` | 条款 | `/terms` | P2 | 已上线 |  |
| `F-GL-EXPORT` | 报告导出 | `报告页组件` | P1 | 已上线 | Copy Link / Markdown / Cursor prompt |
| `F-GL-AFFILIATE` | 联盟推荐 | `报告页` | P1 | 可选 | 需 NEXT_PUBLIC_AFFILIATE_MONITOR_URL |
| `F-GL-GA` | GA4 | `layout` | P1 | 可选 | 需 NEXT_PUBLIC_GA_ID |
| `F-GL-ENGINE` | 扫描引擎 16+ finding | `run-scan.ts` | P0 | 已上线 | 见 06-business-rules |

## 扫描 Finding ID（引擎产出）

`https_redirect` · `security_headers` · `robots_txt` · `noindex` · `title_description.title` · `title_description.description` · `h1` · `canonical` · `open_graph` · `favicon` · `preview_leak` · `placeholder_copy` · `analytics` · `trust_pages.missing` · `trust_pages.broken` · `sitemap` · `sitemap.dirty`

类型有但**不产出**：`tls_cert` · `platform_fingerprint`
