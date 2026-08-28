# Security Headers Checker

| 字段 | 内容 |
|------|------|
| 功能 ID | `F-GL-FOCUS-HEADERS` |
| URL | `/security-headers-checker` |
| 代码入口 | `src/app/security-headers-checker/page.tsx` |
| 状态 | 已上线 |

## 1. 页面目标（用户 Job）

检测常见安全响应头缺失（合并为一条 warning）。

## 2. URL / 别名 / 重定向

- 规范 URL：`/security-headers-checker`
- 无额外别名

## 3. 入口

- 安全意图；可挂联盟

## 4. 首屏与主 CTA

- focus=security_headers

## 5. 交互逐步说明

同单检。

## 6. 展示字段与含义

Finding：`security_headers`（缺 HSTS/CSP/XFO/XCTO/Referrer-Policy/Permissions-Policy）

## 7. 校验与错误

同通用。

## 8. SEO 功能点

pageMetadata。

## 9. 相关页 / 内链

`/security`、`/missing-security-headers-nextjs`

## 10. 验收要点

- [ ] 缺头时 warning 且分数扣减有帽
