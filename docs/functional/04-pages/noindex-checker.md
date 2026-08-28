# Noindex Checker

| 字段 | 内容 |
|------|------|
| 功能 ID | `F-GL-FOCUS-NOINDEX` |
| URL | `/noindex-checker` |
| 代码入口 | `src/app/noindex-checker/page.tsx` |
| 状态 | 已上线 |

## 1. 页面目标（用户 Job）

检测 meta robots / X-Robots-Tag 的 noindex（blocker）。

## 2. URL / 别名 / 重定向

- 规范 URL：`/noindex-checker`
- 无额外别名

## 3. 入口

- 事故排查意图

## 4. 首屏与主 CTA

- focus=noindex

## 5. 交互逐步说明

同单检。

## 6. 展示字段与含义

Finding：`noindex`（blocker）

## 7. 校验与错误

同通用。

## 8. SEO 功能点

pageMetadata。

## 9. 相关页 / 内链

`/forgot-noindex-production`

## 10. 验收要点

- [ ] 生产 noindex 标 DENIED 相关 blocker
