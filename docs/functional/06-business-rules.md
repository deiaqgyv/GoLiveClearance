# 业务规则 — Go-Live Clearance

## 1. Clearance

| 条件 | clearance | UI |
|------|-----------|-----|
| 存在 blocker | `no_go` | DENIED |
| 无 blocker，有 warning | `hold` | HOLD |
| 无 blocker/warning | `go` | CLEARED |

> 注意：AGENTS.md 若写「零 blocker 即 CLEARED」与代码不符；**以 `score.ts` 为准**（需零 warning 才是 go）。

## 2. 分数

- `score = 100 - blockers×25 - warnings×5`
- `security_headers*` 合计额外扣分最多 **10**
- Focus 模式另有简化计分（见 `focus.ts`）

## 3. 优先修复

- `priorityFixIds` 最多 3 个；blocker 优先；安全头靠后

## 4. 关键检查规则（摘要）

| ID | 要点 |
|----|------|
| https_redirect | 最终 URL 非 https → blocker |
| robots_txt | Disallow:/ → blocker；404/失败 → warning |
| noindex | meta 或头 → blocker |
| title | 缺/过短/过长 → warning |
| description | 缺或长度∉50–160 → warning |
| h1 | 无 h1 → warning |
| canonical | 无 → warning |
| open_graph | 缺 title/desc/image → warning |
| favicon | 无 link 且 /favicon.ico 无效 → warning |
| security_headers | 缺常见安全头合并一条 warning |
| preview_leak | 生产页 canonical 泄露预览域 → blocker 或 warning |
| placeholder_copy | 占位文案 → warning |
| analytics | 首页无分析片段 → warning |
| trust_pages | Privacy/Terms/Contact 缺失或坏链 → warning |
| sitemap | 找不到/脏 → warning |

## 5. 安全与滥用

- SSRF 防护（`ssrf.ts`）
- 限流（`rate-limit.ts`）
- 仅扫描公开 URL；不登录目标站后台

## 6. 已知文档漂移

- Methodology 将多安全头写成独立项；引擎合并为 `security_headers`
- `tls_cert` 未实现 emit
