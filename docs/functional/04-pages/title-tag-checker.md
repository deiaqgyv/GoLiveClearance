# Title Tag Checker

| 字段 | 内容 |
|------|------|
| 功能 ID | `F-GL-FOCUS-TITLE` |
| URL | `/title-tag-checker` |
| 代码入口 | `src/app/title-tag-checker/page.tsx` |
| 状态 | 已上线 |

## 1. 页面目标（用户 Job）

检查目标页 title 是否缺失/过短/过长。

## 2. URL / 别名 / 重定向

- 规范 URL：`/title-tag-checker`
- 无额外别名

## 3. 入口

- SEO hub / 搜索意图 title tag checker

## 4. 首屏与主 CTA

- ToolLanding + ScanForm（focus=title）

## 5. 交互逐步说明

提交后 focus 扫描 → 报告页展示 title 相关 finding；可通过 full clearance 扩展。

## 6. 展示字段与含义

Finding：`title_description.title`

## 7. 校验与错误

同通用扫描错误。

## 8. SEO 功能点

pageMetadata self-canonical；工具意图文案。

## 9. 相关页 / 内链

`/seo-checkers`、相关 SEO 单检页。

## 10. 验收要点

- [ ] focus 模式下 title 问题被标出或 pass
