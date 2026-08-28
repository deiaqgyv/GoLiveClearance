# 非功能需求 — Go-Live Clearance

- 扫描 API 超时约 8s
- 托管：Vercel；域名 www 规范
- 隐私：扫描公开页；报告含目标 URL 摘要级 evidence
- 浏览器：现代常青浏览器
- 无障碍：登机牌 UI，需保持表单可键盘操作（以实现为准）
- 安全：SSRF、HMAC、robots disallow 私有路径
