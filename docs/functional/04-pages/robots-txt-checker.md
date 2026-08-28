# Robots.txt Checker

| 字段 | 内容 |
|------|------|
| 功能 ID | `F-GL-FOCUS-ROBOTS` |
| URL | `/robots-txt-checker` |
| 代码入口 | `src/app/robots-txt-checker/page.tsx` |
| 状态 | 已上线 |

## 1. 页面目标（用户 Job）

检测 Disallow:/、robots 不可达等。

## 2. URL / 别名 / 重定向

- 规范 URL：`/robots-txt-checker`
- 无额外别名

## 3. 入口

- 上线事故意图

## 4. 首屏与主 CTA

- focus=robots_txt

## 5. 交互逐步说明

同单检。

## 6. 展示字段与含义

Finding：`robots_txt`

## 7. 校验与错误

同通用。

## 8. SEO 功能点

pageMetadata。

## 9. 相关页 / 内链

`/disallow-all-robots-txt`

## 10. 验收要点

- [ ] Disallow:/ 为 blocker
