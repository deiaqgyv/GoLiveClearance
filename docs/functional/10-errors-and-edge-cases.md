# 错误与边界 — Go-Live Clearance

| 场景 | 期望 |
|------|------|
| 空 URL / 非 URL | invalid_url |
| localhost / 内网 / 元数据 IP | ssrf_blocked |
| 过快重复请求 | rate_limited |
| 目标超时/不可达 | fetch_failed 或 scan_timeout |
| 报告无 token 或多实例 | 可能无法读取 |
| 报告过期（>7 天） | 不可用 |
| Focus pass | 可合成 pass finding |
