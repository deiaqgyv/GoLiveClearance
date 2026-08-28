# Go-Live Clearance 功能文档索引

| 项 | 内容 |
|----|------|
| 产品 | Go-Live Clearance |
| 文档版本 | 1.0.0 |
| 编写日期 | 2026-08-22 |
| 依据 | 仓库源码（冲突时以代码为准） |
| 方案 | `流量站/docs/FUNCTIONAL-DOC-PLAN.md` |

## 一句话

粘贴即将上线或刚上线的公开 URL，约 30 秒内得到 CLEARED / HOLD / DENIED 清关报告与可执行修复建议。

## 阅读顺序

1. `01-product-overview.md`
2. `02-information-architecture.md`
3. `03-feature-catalog.md`
4. `04-pages/`（按需查阅具体页）
5. `05-user-flows.md` → `06-business-rules.md` → `07-states-and-data.md`
6. `08-integrations.md` → `09-seo-functional.md` → `10-errors-and-edge-cases.md` → `11-nfr.md`
7. `12-acceptance-checklist.md`

核心链路详见 `05-user-flows.md`（Scan → Report）。

## 维护约定

- 新增公开路由：同步更新 `02`、`03`、`04-pages`、`12`
- 改业务规则：同步 `06` 与相关 page 文档
- 变更记录：`CHANGELOG-functional.md`
