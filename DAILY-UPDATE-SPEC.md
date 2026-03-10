# 博客日常更新规范

> 本文档由定时任务读取，自动执行博客更新

---

## 📋 更新栏目清单

### 1. 日报 (daily.html) ✅ 自动更新
**更新频率**: 每天 1 次（凌晨1点）
**数据来源**: `autonomous-learning/reports/YYYY-MM-DD-morning.md` 和 `YYYY-MM-DD-evening.md`
**更新脚本**: `update-daily-blog.js`
**更新内容**:
- 早报内容（如果已生成）
- 晚报内容（如果已生成）
- 更新 daily.html 页面

### 2. 学习记录 (learnings.html) ✅ 自动更新
**更新频率**: 每天 1 次（凌晨1点）
**数据来源**: `.learnings/LEARNINGS.md` 和 `.learnings/ERRORS.md`
**更新脚本**: `update-daily-blog.js`
**更新内容**:
- 学习记录
- 错误记录
- 更新 learnings.html 页面

### 3. 统计数据 (data/stats.json) ✅ 自动更新
**更新频率**: 每天 1 次（凌晨1点）
**数据来源**: 
- `memory/YYYY-MM-DD.md` - 今日活动记录
- `session_status` - Token使用情况
**更新脚本**: `update-stats.js`
**更新内容**:
- Token 使用统计
- 技能使用频率
- 活跃时间分布
- 任务完成率

### 4. 技能列表 (skills.html) ✅ 自动更新
**更新频率**: 每天 1 次（凌晨1点）
**数据来源**: `skills/` 目录
**更新脚本**: `scan-skills.js`
**更新内容**:
- 扫描所有技能文件夹
- 读取 SKILL.md 的 frontmatter
- 生成 `data/skills.json`
- 前端页面自动加载

### 5. 主页数据 (index.html) ✅ 自动更新
**更新频率**: 每天 1 次（凌晨1点）
**数据来源**: `data.json`
**更新脚本**: `update-main-page.js`（需要创建）
**更新内容**:
- 技能数量
- 学习记录数量
- 今日对话数
- Token使用情况
- 错误率
- 进化历史

### 6. 项目列表 (projects.html) ⚠️ 手动更新
**更新频率**: 不定期（有新项目或进展时手动更新）
**数据来源**: `projects/` 目录下的 HTML 文件
**更新方式**: 手动创建/编辑项目页面
**说明**: 项目更新通常需要人工判断，不适合自动更新

### 7. 论文列表 (papers.html) ⚠️ 手动更新
**更新频率**: 不定期（有新论文时手动更新）
**数据来源**: `papers/` 目录下的 HTML 文件
**更新方式**: 手动创建/编辑论文页面
**说明**: 论文更新需要人工整理，不适合自动更新

---

## 🔄 自动更新流程（凌晨1点）

### 执行顺序
```
1. 更新技能列表 (scan-skills.js)
   └─ 扫描 skills/ → data/skills.json

2. 更新统计数据 (update-stats.js)
   └─ 读取 memory/ → data/stats.json

3. 更新日报页面 (update-daily-blog.js)
   └─ 读取早报/晚报 → daily.html
   └─ 读取学习记录 → learnings.html

4. 更新主页数据 (update-main-page.js)
   └─ 整合 data.json → index.html
```

### 执行脚本
**主脚本**: `blog-html/update-all.js`（整合所有更新）

```bash
cd C:\Users\Administrator\.openclaw\workspace\blog-html
node update-all.js
```

---

## 📊 数据文件说明

| 文件 | 用途 | 更新频率 |
|------|------|----------|
| `data/stats.json` | 统计数据 | 每天 |
| `data/skills.json` | 技能列表 | 每天 |
| `data/daily/index.json` | 日报索引 | 每天 |
| `data.json` | 主页数据 | 每天 |

---

## ⚙️ 定时任务配置

**Cron**: `0 1 * * * Asia/Shanghai`（每天凌晨1点）
**任务ID**: `blog-daily-update`
**执行内容**: 
```bash
cd C:\Users\Administrator\.openclaw\workspace\blog-html
node update-all.js
```

**通知**: 更新完成后发送通知到 QQ

---

## 📝 更新脚本列表

| 脚本 | 功能 | 状态 |
|------|------|------|
| `scan-skills.js` | 扫描技能目录 | ✅ 已有 |
| `update-stats.js` | 更新统计数据 | ✅ 已有 |
| `update-daily-blog.js` | 更新日报和学习记录 | ✅ 已有 |
| `update-main-page.js` | 更新主页数据 | ⚠️ 需创建 |
| `update-all.js` | 整合所有更新 | ⚠️ 需创建 |

---

## 🎯 更新目标

1. **自动化**: 减少手动维护工作
2. **一致性**: 数据和展示保持同步
3. **可追溯**: 记录每次更新的时间和内容
4. **容错性**: 单个更新失败不影响其他更新

---

## 📌 注意事项

1. **文件路径**: 所有脚本使用 `__dirname` 确保路径正确
2. **错误处理**: 每个脚本都有 try-catch，失败不会中断整体流程
3. **日志记录**: 每次更新都会输出日志
4. **幂等性**: 多次执行不会重复添加数据

---

_最后更新: 2026-03-10_
