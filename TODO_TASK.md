# 博客系统重构任务清单

> 三条基准：规范化、长期存取、链接统一
> 
> 创建时间：2026-03-10
> 最后更新：2026-03-10 21:45

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
  - ✅ get(key) - 获取缓存
  - ✅ set(key, value) - 设置缓存
  - ✅ clear() - 清除缓存
- ✅ PaginationManager 分页管理
  - ✅ loadData() - 加载数据
  - ✅ render() - 渲染页面
  - ✅ nextPage() - 下一页
  - ✅ setupLazyLoad() - 设置懒加载

---

### 2. ✅ 长期存取（Long-term Access）
**目标**：支持动态加载和部分加载，避免一次性加载过多数据

**实现方式**：
- ✅ 分页加载：每页10条数据
- ✅ 懒加载：滚动到底部自动加载更多
- ✅ 数据缓存：5分钟缓存，减少重复请求
- ✅ 错误处理：加载失败显示友好提示

**技术实现**：
```javascript
// 分页加载
loadArticleIndex('daily', 1, 10)  // 加载第1页，每页10条

// 懒加载
setupLazyLoad(manager)  // 滚动到底部自动加载

// 数据缓存
DataCache.set('index_daily', data, 300000)  // 缓存5分钟
```

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

## 📄 所有页面重构状态

### 根目录页面

| 页面 | 状态 | 优化前 | 优化后 | 减少 | 使用统一模块 |
|------|------|--------|--------|------|--------------|
| index.html | ✅ 完成 | 10.9KB | 4.5KB | -59% | ✅ |
| projects.html | ✅ 完成 | 12.5KB | 3.4KB | -73% | ✅ |
| papers.html | ✅ 完成 | 20.7KB | 3.1KB | -85% | ✅ |
| skills.html | ✅ 完成 | 6.5KB | 3.4KB | -48% | ✅ |
| learnings.html | ✅ 完成 | 11.3KB | 4.6KB | -59% | ✅ |
| skill-detail.html | ✅ 完成 | 10.8KB | 3.5KB | -68% | ✅ |
| article.html | ✅ 完成 | 10KB | 3KB | -70% | ✅ |

### pages/ 目录页面

| 页面 | 状态 | 优化前 | 优化后 | 减少 | 使用统一模块 |
|------|------|--------|--------|------|--------------|
| pages/daily.html | ✅ 完成 | 9KB | 2.3KB | -74% | ✅ |
| pages/paper-detail.html | ✅ 完成 | 10KB | 2.9KB | -71% | ✅ |
| pages/project-detail.html | ✅ 完成 | 10KB | 2.9KB | -71% | ✅ |

### keke/ 目录页面

| 页面 | 状态 | 优化前 | 优化后 | 减少 | 使用统一模块 |
|------|------|--------|--------|------|--------------|
| keke/index.html | ✅ 完成 | 12KB | 3.8KB | -68% | ✅ |

### about/ 目录页面

| 页面 | 状态 | 优化前 | 优化后 | 减少 | 使用统一模块 |
|------|------|--------|--------|------|--------------|
| about/linhai.html | ⏳ 待重构 | 未知 | - | - | ❌ |
| about/keke.html | ⏳ 待重构 | 未知 | - | - | ❌ |

---

## 🔧 需要重构的页面

### 1. about/about-lin.html（17KB）
**当前状态**：未重构，有大量内联样式
**当前问题**：
- ❌ 引用 `css/style.css`（不存在）
- ❌ 所有样式都内联在 `<style>` 标签中
- ❌ 没有使用统一模块
- ❌ 导航栏链接不完整（缺少"技能"）

**需要修改**：
1. [ ] 修改 CSS 引用：`<link rel="stylesheet" href="../css/common.css">`
2. [ ] 添加页面特定样式（如果有）：
   ```html
   <style>
   /* about页面特有的样式 */
   .about-hero { ... }
   .research-areas { ... }
   .project-cards { ... }
   </style>
   ```
3. [ ] 添加 JS 引用：`<script src="../js/common.js"></script>`
4. [ ] 添加主题类：`<body class="theme-linhai">`
5. [ ] 使用统一导航栏：
   ```html
   <div id="navbar"></div>
   <script>
   document.getElementById('navbar').innerHTML = BlogUtils.renderNavbar('about-lin', '关于林海');
   </script>
   ```
6. [ ] 使用统一页脚：
   ```html
   <div id="footer"></div>
   <script>
   document.getElementById('footer').innerHTML = BlogUtils.renderFooter();
   </script>
   ```
7. [ ] 删除内联样式中的通用样式（已在 common.css 中）
8. [ ] 保留页面特有的样式

**预计优化**：17KB → 5KB（-70%）

---

### 2. about/about-keke.html（19.5KB）
**当前状态**：未重构，有大量内联样式
**当前问题**：
- ❌ 引用 `css/style.css`（不存在）
- ❌ 所有样式都内联在 `<style>` 标签中
- ❌ 没有使用统一模块
- ❌ 导航栏链接不完整（缺少"技能"）

**需要修改**：
1. [ ] 修改 CSS 引用：`<link rel="stylesheet" href="../css/common.css">`
2. [ ] 添加页面特定样式（如果有）
3. [ ] 添加 JS 引用：`<script src="../js/common.js"></script>`
4. [ ] 添加主题类：`<body class="theme-keke">`
5. [ ] 使用统一导航栏：
   ```html
   <div id="navbar"></div>
   <script>
   document.getElementById('navbar').innerHTML = BlogUtils.renderNavbar('about-keke', '关于可可');
   </script>
   ```
6. [ ] 使用统一页脚
7. [ ] 删除内联样式中的通用样式
8. [ ] 保留页面特有的样式

**预计优化**：19.5KB → 6KB（-69%）

---

### 3. 可选：创建 about.css（如果需要）

如果 about 页面有很多特有样式，可以创建 `css/about.css`：

```css
/* about页面特有样式 */

/* Hero区域 */
.about-hero {
    text-align: center;
    padding: 3rem 0;
}

.hero-content h1 {
    font-size: 2.5rem;
    margin: 1rem 0;
}

.hero-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin-top: 2rem;
}

/* 研究方向卡片 */
.research-areas {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.area-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    text-align: center;
    border: 2px solid #f0f0f0;
    transition: all 0.3s;
}

.area-card:hover {
    border-color: #667eea;
    transform: translateY(-5px);
}

/* 项目卡片 */
.project-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

/* 荣誉卡片 */
.honors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.honor-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    border: 2px solid #f0f0f0;
}

.honor-card.gold {
    border-color: #ffd700;
    background: linear-gradient(135deg, #fffbf0 0%, #fff9e6 100%);
}

.honor-card.silver {
    border-color: #c0c0c0;
    background: linear-gradient(135deg, #f9f9f9 0%, #f5f5f5 100%);
}
```

然后 about 页面引用：
```html
<link rel="stylesheet" href="../css/common.css">
<link rel="stylesheet" href="../css/about.css">
```

---

## 📊 重构统计

### 已完成
- ✅ 9个页面完成重构
- ✅ 代码量减少：93.7KB → 31.6KB（-66%）
- ✅ 创建统一模块：css/common.css (11KB) + js/common.js (12KB)

### 待完成
- ⏳ 2个页面待重构（about/目录）
- ⏳ 预计可再减少：~15KB

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
- [ ] 分页加载正常
- [ ] 懒加载正常
- [ ] 数据缓存生效
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

## 🎯 下一步计划

1. **重构 about/ 目录页面**
   - [ ] 重构 about/linhai.html
   - [ ] 重构 about/keke.html
   - [ ] 验证所有功能

2. **性能优化**
   - [ ] 压缩 CSS 文件
   - [ ] 压缩 JS 文件
   - [ ] 图片懒加载
   - [ ] 添加 Service Worker

3. **功能扩展**
   - [ ] 搜索功能
   - [ ] 评论系统
   - [ ] RSS 订阅
   - [ ] 暗黑模式

4. **文档完善**
   - [ ] 更新 README.md
   - [ ] 添加开发文档
   - [ ] 添加部署文档

---

## 📝 更新日志

### 2026-03-10 21:45
- ✅ 创建任务清单
- ✅ 记录所有复用模块
- ✅ 列出所有页面状态
- ✅ 标记待完成任务

### 2026-03-10 21:40
- ✅ 完成所有主要页面重构
- ✅ 代码量减少66%
- ✅ 统一模块系统

---

_严格按照三条基准执行：规范化、长期存取、链接统一_