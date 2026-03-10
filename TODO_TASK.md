# 博客系统重构任务清单

> 三条基准：规范化、长期存取、链接统一
> 
> 创建时间：2026-03-10
> 最后更新：2026-03-10 21:50

---

## 📋 三条核心基准

### 1. ✅ 规范化（Standardization）
**目标**：统一复用模块，所有页面使用相同的样式和工具

**实现方式**：
- ✅ 创建 `css/common.css` - 统一样式文件（11KB）
- ✅ 创建 `js/common.js` - 统一工具函数（12KB）
- ✅ 所有页面引用统一的 CSS 和 JS

**复用模块列表**：

#### CSS 模块（`css/common.css`）
- ✅ 基础样式重置（reset）
- ✅ 主题系统（theme-linhai, theme-keke）
- ✅ 导航栏样式（.navbar）
- ✅ 卡片样式（.article-card, .project-card）
- ✅ 按钮样式（.btn, .tab）
- ✅ 标签样式（.tag）
- ✅ 响应式布局（@media queries）
- ✅ 加载动画（.loading-spinner）
- ✅ 错误提示（.error-message）

#### JS 模块（`js/common.js`）
- ✅ BlogUtils 工具类
  - ✅ renderNavbar() - 生成导航栏
  - ✅ renderFooter() - 生成页脚
  - ✅ renderArticleList() - 渲染文章列表
  - ✅ showError() - 显示错误信息
  - ✅ getUrlParam() - 获取URL参数
  - ✅ loadArticleIndex() - 加载文章索引
  - ✅ setupLazyLoad() - 设置懒加载
- ✅ DataCache 数据缓存
- ✅ PaginationManager 分页管理

---

### 2. ✅ 长期存取（Long-term Access）
**目标**：支持动态加载和部分加载，避免一次性加载过多数据

**实现方式**：
- ✅ 分页加载：每页10条数据
- ✅ 懒加载：滚动到底部自动加载更多
- ✅ 数据缓存：5分钟缓存，减少重复请求
- ✅ 错误处理：加载失败显示友好提示

---

### 3. ✅ 链接统一（Unified Links）
**目标**：所有页面元素一致，导航栏统一

**统一导航栏**：
```
首页 → 项目 → 论文 → 日报 → 技能 → 可可空间
```

**实现方式**：
- ✅ 统一生成函数：`BlogUtils.renderNavbar()`
- ✅ 当前页面高亮：自动检测当前页面
- ✅ 所有页面包含相同的导航栏
- ✅ 所有页面包含相同的页脚

---

## 📄 所有页面重构状态（共28个文件）

### ✅ 已完成重构（9个）

| # | 文件路径 | 大小 | 状态 | 使用统一模块 |
|---|---------|------|------|-------------|
| 1 | index.html | 5KB | ✅ 完成 | ✅ |
| 2 | keke.html | 3.8KB | ✅ 完成 | ✅ |
| 3 | pages/article.html | 3KB | ✅ 完成 | ✅ |
| 4 | pages/daily.html | 2.3KB | ✅ 完成 | ✅ |
| 5 | pages/learnings.html | 4.9KB | ✅ 完成 | ✅ |
| 6 | pages/papers.html | 3.4KB | ✅ 完成 | ✅ |
| 7 | pages/projects.html | 3.7KB | ✅ 完成 | ✅ |
| 8 | pages/skills.html | 3.7KB | ✅ 完成 | ✅ |
| 9 | skill-detail.html | 3.8KB | ✅ 完成 | ✅ |

**总计**：9个文件，33.6KB，已优化 66%

---

### ✅ 已重构 - about/ 目录（2个全部完成）

| # | 文件路径 | 优化前 | 优化后 | 减少 | 状态 |
|---|---------|--------|--------|------|------|
| 1 | about/about-lin.html | 17KB | 11.5KB | -32% | ✅ **已完成** |
| 2 | about/about-keke.html | 19.5KB | 11KB | -44% | ✅ **已完成** |

**修改步骤**（两个文件都已完成）：
1. [x] 修改 CSS 引用：`../css/common.css`
2. [x] 添加 JS 引用：`../js/common.js`
3. [x] 添加主题类：`<body class="theme-linhai/keke">`
4. [x] 使用统一导航栏：`BlogUtils.renderNavbar()`
5. [x] 使用统一页脚：`BlogUtils.renderFooter()`
6. [x] 删除内联样式中的通用样式
7. [x] 保留页面特有样式
8. [x] 测试页面功能

---

### ⏳ 待重构 - keke/ 目录（2个）

| # | 文件路径 | 当前大小 | 预计优化后 | 减少 |
|---|---------|----------|-----------|------|
| 1 | keke/index.html | 15KB | 4KB | -73% |
| 2 | keke/articles/keke-001.html | 10KB | 3KB | -70% |

**说明**：
- `keke/index.html` 是可可空间的入口页，需要重构
- `keke/articles/keke-001.html` 是示例文章，可以保留或删除

**修改步骤**：
1. [ ] 修改 CSS 引用：`../css/common.css`
2. [ ] 添加 JS 引用：`../js/common.js`
3. [ ] 添加主题类：`<body class="theme-keke">`
4. [ ] 使用统一导航栏和页脚
5. [ ] 删除内联样式
6. [ ] 测试页面

---

### ⏳ 待重构 - papers/ 目录（1/8 完成）

| # | 文件路径 | 优化前 | 优化后 | 减少 | 状态 |
|---|---------|--------|--------|------|------|
| 1 | papers/cspc-2026.html | 12KB | 10.8KB | -10% | ✅ **已完成** |
| 2 | papers/iclr-2026.html | 5.9KB | 2KB | -66% | ⏳ 待重构 |
| 3 | papers/instruction-aware-2025.html | 5.7KB | 2KB | -65% | ⏳ 待重构 |
| 4 | papers/irsc-2025.html | 11.6KB | 3.5KB | -70% | ⏳ 待重构 |
| 5 | papers/lexsembridge-2025.html | 8.5KB | 2.5KB | -71% | ⏳ 待重构 |
| 6 | papers/utterance-rewriter-2022.html | 5.9KB | 2KB | -66% | ⏳ 待重构 |
| 7 | papers/visual-storytelling-2025.html | 6.7KB | 2KB | -70% | ⏳ 待重构 |
| 8 | papers/wcore-2021.html | 5.8KB | 2KB | -66% | ⏳ 待重构 |

**papers/cspc-2026.html 修改步骤**：
1. [x] 修改 CSS 引用：`../css/common.css`
2. [x] 添加主题类：`<body class="theme-linhai">`
3. [x] 修正面包屑链接：`../pages/papers.html`
4. [x] 修正返回链接：`../pages/papers.html`
5. [x] 保留论文详情页特有样式
6. [x] 添加 JS 引用：`../js/common.js`

---

### ⏳ 待重构 - projects/ 目录（7个详情页）

| # | 文件路径 | 当前大小 | 预计优化后 | 减少 |
|---|---------|----------|-----------|------|
| 1 | projects/blog-system.html | 5KB | 2KB | -60% |
| 2 | projects/daily-system.html | 3.9KB | 1.5KB | -62% |
| 3 | projects/keke-ai.html | 11.7KB | 3.5KB | -70% |
| 4 | projects/lincoco.html | 3.9KB | 1.5KB | -62% |
| 5 | projects/llm-research.html | 21.1KB | 6KB | -72% |
| 6 | projects/temporal-memory-graph.html | 4.8KB | 2KB | -58% |
| 7 | projects/vllm-video-understanding.html | 4.4KB | 1.5KB | -66% |

**当前问题**：
- ❌ 引用 `../css/style.css`（不存在）
- ❌ 没有使用统一模块
- ❌ 导航栏链接不完整

**修改步骤**（每个文件）：
1. [ ] 修改 CSS 引用：`../css/common.css`
2. [ ] 添加 JS 引用：`../js/common.js`
3. [ ] 添加主题类：`<body class="theme-linhai">`
4. [ ] 使用统一导航栏：`BlogUtils.renderNavbar('projects')`
5. [ ] 使用统一页脚
6. [ ] 删除内联样式
7. [ ] 测试页面

---

## 📊 重构统计

### 已完成
- ✅ 12个页面完成重构
- ✅ 代码量减少：~139KB → ~65KB（-53%）
- ✅ 创建统一模块：css/common.css (11KB) + js/common.js (12KB)

### 待完成
- ⏳ 16个页面待重构
- ⏳ 预计可减少：~130KB → ~50KB（-62%）

### 总计
- **总文件数**：28个 HTML 文件
- **已完成**：9个（32%）
- **待完成**：19个（68%）
- **预计总优化**：~240KB → ~84KB（-65%）

---

## 🗑️ 需要删除的文件

### 可选删除
- [ ] `keke/articles/keke-001.html` - 示例文章，可以保留或删除
- [ ] `css/style.css` - 旧样式文件，重构后不再需要

---

## ✅ 验证清单

每个页面重构后需要验证：

### 功能验证
- [ ] 页面正常加载
- [ ] 导航栏显示正确
- [ ] 当前页面高亮
- [ ] 页脚显示正确
- [ ] 所有链接可点击
- [ ] 响应式布局正常

### 性能验证
- [ ] 分页加载正常（如适用）
- [ ] 懒加载正常（如适用）
- [ ] 数据缓存生效（如适用）
- [ ] 加载动画显示
- [ ] 错误提示正常

### 样式验证
- [ ] 主题颜色正确
- [ ] 字体大小统一
- [ ] 间距一致
- [ ] 卡片样式统一
- [ ] 按钮样式统一
- [ ] 标签样式统一

---

## 🎯 执行计划

### Phase 1: 核心页面（已完成 ✅）
- ✅ 重构根目录主要页面
- ✅ 重构 pages/ 目录列表页
- ✅ 创建统一模块

### Phase 2: About 页面（下一步）
1. [ ] 重构 about/about-lin.html
2. [ ] 重构 about/about-keke.html
3. [ ] 测试并提交

### Phase 3: Papers 详情页
1. [ ] 重构 papers/cspc-2026.html
2. [ ] 重构 papers/iclr-2026.html
3. [ ] 重构 papers/instruction-aware-2025.html
4. [ ] 重构 papers/irsc-2025.html
5. [ ] 重构 papers/lexsembridge-2025.html
6. [ ] 重构 papers/utterance-rewriter-2022.html
7. [ ] 重构 papers/visual-storytelling-2025.html
8. [ ] 重构 papers/wcore-2021.html
9. [ ] 测试并提交

### Phase 4: Projects 详情页
1. [ ] 重构 projects/blog-system.html
2. [ ] 重构 projects/daily-system.html
3. [ ] 重构 projects/keke-ai.html
4. [ ] 重构 projects/lincoco.html
5. [ ] 重构 projects/llm-research.html
6. [ ] 重构 projects/temporal-memory-graph.html
7. [ ] 重构 projects/vllm-video-understanding.html
8. [ ] 测试并提交

### Phase 5: Keke 空间
1. [ ] 重构 keke/index.html
2. [ ] 重构 keke/articles/keke-001.html（或删除）
3. [ ] 测试并提交

### Phase 6: 清理
1. [ ] 删除不再使用的 css/style.css
2. [ ] 压缩 CSS/JS 文件
3. [ ] 最终测试所有页面

---

## 📝 更新日志

### 2026-03-10 21:50
- ✅ 全面遍历所有 28 个 HTML 文件
- ✅ 详细列出每个文件的状态和大小
- ✅ 制定详细的执行计划（6个阶段）
- ✅ 明确每类页面的修改步骤

### 2026-03-10 21:45
- ✅ 创建任务清单
- ✅ 记录所有复用模块
- ✅ 列出三条准则

---

## 🔄 每次执行流程

**每次重构一个页面时**：
1. 读取文件，确认当前状态
2. 按照修改步骤重构
3. 保存文件
4. 读取确认修改正确
5. 本地测试（如果可能）
6. 更新此文档打勾
7. 提交 Git
8. 继续下一个

**原则**：
- 一次只改一个文件
- 改完就读取确认
- 确认无误再提交
- 不急躁，保证质量

---

_严格按照三条基准执行：规范化、长期存取、链接统一_