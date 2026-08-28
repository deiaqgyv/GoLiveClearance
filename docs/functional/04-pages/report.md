# Scan Report

| 字段 | 内容 |
|------|------|
| 功能 ID | `F-GL-REPORT` |
| URL | `/report/[id]` |
| 代码入口 | `src/app/report/[id]/page.tsx` |
| 状态 | 已上线 |

## 1. 页面目标（用户 Job）

展示清关证书、finding、修复、导出与可选联盟；需有效 token。

## 2. URL / 别名 / 重定向

- 规范 URL：`/report/[id]`
- 查询参数 `?t=` 为签名 token（必填跨实例）
- robots noindex

## 3. 入口

- 站内导航 / hub / 内链
- 搜索落地
- 扫描成功后跳转

## 4. 首屏与主 CTA

- 标题与导语
- ClearanceBadge + 导出按钮

## 5. 交互逐步说明

1. 打开带 token 的报告链接
2. 查看 clearance/score/findings
3. 复制链接/Markdown/Cursor prompt
4. 可选联盟 CTA
5. Re-inspect compact ScanForm

## 6. 展示字段与含义

clearance, score, findings, priorityFixIds, urlFinal, expiresAt, platform

## 7. 校验与错误

token 无效/过期 → 不可读报告；无广告错误页细节以实现为准

## 8. SEO 功能点

noindex,nofollow；不进 sitemap

## 9. 相关页 / 内链

相关 hub / 工具页 / methodology

## 10. 验收要点

- [ ] 页面可打开且主 CTA 可用
- [ ] 与功能 ID `F-GL-REPORT` 行为一致
