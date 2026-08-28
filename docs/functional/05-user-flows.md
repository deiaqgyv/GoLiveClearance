# 用户流程 — Go-Live Clearance

## Flow A：全量清关（主路径）

1. 用户打开 `/` 或清单页
2. 输入公开 https URL → 提交
3. `ScanForm` → `POST /api/scan`
4. API：normalize → SSRF 检查 → 限流 →（缓存命中可短路）→ `runScan`（约 8s 超时）→ `saveReport`
5. 前端跳转 `/report/{id}?t={token}`
6. 用户阅读 CLEARED/HOLD/DENIED、优先修复、导出

**失败分支：** invalid_url / ssrf_blocked / rate_limited / fetch_failed / scan_timeout → 表单错误，不跳转。

## Flow B：Focus 单检

1. 打开某 checker 页（带 focus）
2. 同上扫描，但 `applyScanFocus` 收敛结果
3. 报告页可显示 focus 横幅 → 「Run full clearance」回 `/?url=`

## Flow C：分享报告

1. 用户复制报告链接（含 token）
2. 他人打开；HMAC 校验通过则渲染；失败则不可读
3. TTL 7 天过期

## Flow D：Hub 浏览

1. 进入 `/seo-checkers` 等 hub
2. 点击具体工具/叙事页
3. 转入 Flow A/B
