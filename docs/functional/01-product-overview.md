# 产品总览 — Go-Live Clearance

| 字段 | 内容 |
|------|------|
| 域名 | https://www.goliveclearance.com（apex → www） |
| 类型 | 英文 Google 流量站 · URL 扫描工具 |
| 技术栈 | Next.js 16 / React 19 / TypeScript / Vercel |
| 文档日期 | 2026-08-22 |

## 1. 一句话

面向独立开发者与小团队：粘贴公开网址，得到 **Go / Hold / No-Go（CLEARED / HOLD / DENIED）** 上线清关报告，并给出可复制修复代码（偏 Next.js）。

## 2. 目标用户

- Indie / SaaS / Next.js / Vercel 上线前自检
- 已上线但怀疑索引/安全头/OG/robots 事故的排查者

## 3. 核心价值

- 不是泛 SEO 套件，而是「上线前清关条」
- URL 进 → 分数/报告出；报告可分享（签名 token，7 天）

## 4. 明确不做

- Semrush 式全站 SEO 套件
- 邮件发送报告（文档曾提，**未实现**）
- 展示广告（源码无广告位）
- TLS 证书过期深度检测（类型/文案有，**扫描未 emit `tls_cert`**）

## 5. 成功指标（产品层）

- 扫描成功率、报告打开率
- 自然搜索进入工具页后完成扫描
- （变现）非 go 结果下联盟点击（Better Stack，需配置 env）

## 6. 代码真源

| 主题 | 路径 |
|------|------|
| 路由表 | `src/lib/tool-routes.ts` |
| 扫描编排 | `src/lib/scan/run-scan.ts` |
| 评分 | `src/lib/scan/score.ts` |
| 报告存储 | `src/lib/report-store.ts` |
| API | `src/app/api/scan/route.ts` |
