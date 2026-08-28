# SSL / HTTPS Checker

| 字段 | 内容 |
|------|------|
| 功能 ID | `F-GL-FOCUS-HTTPS` |
| URL | `/ssl-https-checker` |
| 代码入口 | `src/app/ssl-https-checker/page.tsx` |
| 状态 | 已上线 |

## 1. 页面目标（用户 Job）

最终 URL 须为 https，否则 blocker。

## 2. URL / 别名 / 重定向

- 规范 URL：`/ssl-https-checker`
- 无额外别名

## 3. 入口

- 安全/上线意图

## 4. 首屏与主 CTA

- focus=https_redirect

## 5. 交互逐步说明

同单检。

## 6. 展示字段与含义

Finding：`https_redirect`

## 7. 校验与错误

超时也可能映射相关错误。

## 8. SEO 功能点

pageMetadata。

## 9. 相关页 / 内链

`/security`

## 10. 验收要点

- [ ] http 最终址 DENIED
