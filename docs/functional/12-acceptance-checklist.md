# 验收清单 — Go-Live Clearance

## 主路径

- [ ] `/` 可对公开站点完成扫描并打开报告
- [ ] 报告展示 clearance、score、findings、优先修复
- [ ] 复制链接后新会话（带 token）可打开
- [ ] 内网 URL 被拒绝

## Focus 工具（抽样）

- [ ] title / h1 / canonical / noindex / robots / headers 各至少 1 次正/负样例

## SEO / 路由

- [ ] sitemap 含 TOOL_ROUTES，不含 `/report/`
- [ ] `/nextjs-launch-checklist` 301 到 production checklist

## 可选集成

- [ ] 配置 GA 后提交扫描有事件
- [ ] 配置联盟 URL 后非 go 报告展示 CTA
