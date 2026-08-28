# 首页全量扫描

| 字段 | 内容 |
|------|------|
| 功能 ID | `F-GL-HOME` |
| URL | `/` |
| 代码入口 | `src/app/page.tsx` |
| 状态 | 已上线 |

## 1. 页面目标（用户 Job）

用户粘贴 URL，发起完整清关扫描并跳转报告。

## 2. URL / 别名 / 重定向

- 规范 URL：`/`
- 域名规范化：apex → www

## 3. 入口

- 主导航 / 品牌搜索进入
- 报告页「Run full clearance」带回 url

## 4. 首屏与主 CTA

- 登机牌视觉首页
- 主 CTA：ScanForm 提交

## 5. 交互逐步说明

1. 输入/粘贴 URL
2. 提交 → POST `/api/scan`
3. 成功 → `/report/{{id}}?t=token`
4. 失败 → 表单错误态（invalid_url / ssrf / rate_limit / timeout 等）

## 6. 展示字段与含义

无独立结果区；结果在报告页。

## 7. 校验与错误

见 API 错误码与 ScanForm 提示。

## 8. SEO 功能点

Root metadata + Organization/WebSite/WebApplication JSON-LD。

## 9. 相关页 / 内链

链向各工具页、清单页、methodology。

## 10. 验收要点

- [ ] 合法公开 URL 可完成扫描并打开报告
- [ ] 非法/内网 URL 被拒绝
