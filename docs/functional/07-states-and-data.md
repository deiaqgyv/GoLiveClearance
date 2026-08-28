# 状态与数据 — Go-Live Clearance

## 1. 前端状态（ScanForm）

- 输入 URL、loading、错误码/文案、可选 focus
- 成功后路由跳转，不长期持久化扫描结果于 localStorage

## 2. ScanResult（核心字段）

`id, clearance, score, urlInput, urlFinal, scannedAt, expiresAt, platform?, focus?, findings[], priorityFixIds[], meta, summary`

## 3. 报告存储

- 内存 Map（同进程）+ 签名 token（跨实例）
- CompactResult 去掉 fixes，读取时 `attachFixes` 回填
- Token：`v1.<payload>.<hmac>`；密钥 `REPORT_HMAC_SECRET`

## 4. API 错误码

`invalid_url | ssrf_blocked | rate_limited | fetch_failed | scan_timeout`
