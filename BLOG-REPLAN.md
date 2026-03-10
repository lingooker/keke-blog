# 博客系统重新规划

> 创建时间：2026-03-11 01:37
> 目标：从零开始，构建简洁、可维护、可扩展的博客系统

---

## 🎯 核心原则

### 1. 简洁性（Simplicity）
- 不要过度设计
- 只做真正有用的功能
- 代码量最小化

### 2. 可维护性（Maintainability）
- 统一的代码规范
- 清晰的目录结构
- 完善的文档

### 3. 可扩展性（Scalability）
- 模块化设计
- 动态加载数据
- 易于添加新功能

### 4. 校验机制（Validation）
- 每个新功能都要验证
- 使用浏览器检查显示效果
- 每次心跳检测进度

---

## 📁 目录结构规划

```
blog-html/
├── index.html              # 主页
├── css/
│   ├── common.css          # 通用样式（主题、布局、组件）
│   └── pages/              # 页面特定样式（按需加载）
├── js/
│   ├── common.js           # 通用工具（导航、数据加载）
│   └── pages/              # 页面特定逻辑（按需加载）
├── data/                   # 数据文件（JSON格式）
│   ├── site.json           # 站点信息
│   ├── papers.json         # 论文列表
│   ├── projects.json       # 项目列表
│   ├── daily.json          # 日报数据
│   └── keke/               # 可可空间数据
│       └── articles.json   # 文章列表
├── pages/                  # 页面目录
│   ├── papers.html         # 论文页
│   ├── projects.html       # 项目页
│   ├── daily.html          # 日报页
│   └── about.html          # 关于页
├── keke/                   # 可可空间
│   ├── index.html          # 可可主页
│   └── articles/           # 文章目录
│       └── article-template.html  # 文章模板
└── docs/                   # 文档
    ├── DESIGN.md           # 设计文档
    └── DATA-FORMAT.md      # 数据格式规范
```

---

## 🎨 通用模块设计

### 1. CSS 通用模块（css/common.css）

#### 主题系统
```css
:root {
  /* 主色 */
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  
  /* 背景色 */
  --bg-color: #f5f7fa;
  --card-bg: #ffffff;
  
  /* 文字色 */
  --text-primary: #2d3748;
  --text-secondary: #718096;
  
  /* 间距 */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  
  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* 阴影 */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

#### 通用组件
- `.container` - 容器（最大宽度1200px）
- `.card` - 卡片
- `.btn` - 按钮
- `.tag` - 标签
- `.navbar` - 导航栏
- `.footer` - 页脚
- `.loading` - 加载动画
- `.error` - 错误提示

---

### 2. JS 通用模块（js/common.js）

#### 核心功能
```javascript
class BlogUtils {
  // 1. 导航栏生成
  static renderNavbar()
  
  // 2. 页脚生成
  static renderFooter()
  
  // 3. 数据加载（带缓存）
  static async loadData(url, cacheTime = 5分钟)
  
  // 4. 文章列表渲染
  static renderArticleList(articles, container)
  
  // 5. 卡片渲染
  static renderCard(item, type)
  
  // 6. 标签渲染
  static renderTags(tags)
  
  // 7. 分页
  static renderPagination(current, total, onPageChange)
  
  // 8. 搜索
  static search(items, query, fields)
  
  // 9. 错误处理
  static showError(message)
  
  // 10. 加载状态
  static showLoading(container)
}
```

#### 数据缓存
```javascript
class DataCache {
  static get(key)
  static set(key, data, ttl = 300000) // 5分钟
  static clear()
}
```

---

## 📊 数据格式规范

### 1. 站点信息（data/site.json）
```json
{
  "title": "林嘿嘿的博客",
  "subtitle": "清华大学 | 大模型研究",
  "author": "林嘿嘿",
  "email": "example@example.com",
  "github": "https://github.com/lingooker",
  "description": "记录学习、研究、思考"
}
```

### 2. 论文数据（data/papers.json）
```json
{
  "papers": [
    {
      "id": "cspc-2026",
      "title": "论文标题",
      "authors": ["作者1", "作者2"],
      "venue": "会议/期刊",
      "year": 2026,
      "abstract": "摘要",
      "tags": ["标签1", "标签2"],
      "pdf": "链接",
      "code": "链接",
      "date": "2026-03-10"
    }
  ]
}
```

### 3. 项目数据（data/projects.json）
```json
{
  "projects": [
    {
      "id": "keke-ai",
      "title": "项目名称",
      "description": "项目描述",
      "tech": ["技术1", "技术2"],
      "status": "进行中/已完成",
      "github": "链接",
      "demo": "链接",
      "date": "2026-03-10"
    }
  ]
}
```

### 4. 日报数据（data/daily.json）
```json
{
  "reports": [
    {
      "date": "2026-03-10",
      "title": "日报标题",
      "content": "日报内容（Markdown）",
      "tags": ["标签1", "标签2"]
    }
  ]
}
```

### 5. 可可文章数据（data/keke/articles.json）
```json
{
  "articles": [
    {
      "id": "keke-001",
      "title": "文章标题",
      "category": "日记随笔/阅读心得/学习笔记/人生感悟",
      "date": "2026-03-10",
      "content": "文章内容（Markdown文件路径）",
      "tags": ["标签1", "标签2"]
    }
  ]
}
```

---

## 🎨 页面设计

### 1. 主页（index.html）
**布局**：
- 顶部：导航栏
- 中部：Hero区（标题 + 简介）
- 下部：卡片网格（最新论文、项目、日报）
- 底部：页脚

**数据加载**：
- 加载 `data/site.json`（站点信息）
- 加载 `data/papers.json`（最新3篇）
- 加载 `data/projects.json`（最新3个）
- 加载 `data/daily.json`（最新3篇）

---

### 2. 论文页（pages/papers.html）
**布局**：
- 导航栏
- 筛选区（按年份、标签）
- 论文列表（卡片）
- 分页
- 页脚

**数据加载**：
- 加载 `data/papers.json`
- 筛选、搜索、分页

---

### 3. 项目页（pages/projects.html）
**布局**：
- 导航栏
- 项目网格（卡片）
- 页脚

**数据加载**：
- 加载 `data/projects.json`

---

### 4. 日报页（pages/daily.html）
**布局**：
- 导航栏
- 时间线（日报列表）
- 页脚

**数据加载**：
- 加载 `data/daily.json`

---

### 5. 可可空间（keke/index.html）
**布局**：
- 导航栏（可可风格）
- Hero区（可可简介）
- 文章分类（日记/阅读/学习/感悟）
- 文章列表
- 页脚

**数据加载**：
- 加载 `data/keke/articles.json`

---

## ✅ 校验机制

### 1. 开发阶段校验
每完成一个模块/页面，执行：
```bash
# 1. 检查文件是否存在
# 2. 检查HTML语法
# 3. 检查CSS语法
# 4. 检查JS语法
# 5. 检查数据格式
```

### 2. 浏览器校验
使用浏览器工具检查：
```javascript
// 1. 打开页面
browser.open("file:///path/to/page.html")

// 2. 截图
browser.screenshot()

// 3. 用视觉识别检查
zhipu.vision("截图", "页面显示是否正常？有什么问题？")

// 4. 检查元素
browser.snapshot()
```

### 3. 心跳校验
每次心跳执行：
```javascript
// 1. 检查数据文件是否有效
// 2. 检查页面是否可访问
// 3. 检查链接是否正常
// 4. 检查显示是否正常
// 5. 记录进度到 blog-html/PROGRESS.md
```

---

## 📝 开发流程

### Phase 1: 基础框架（1天）
1. ✅ 删除旧版本
2. ✅ 创建目录结构
3. ✅ 创建通用CSS
4. ✅ 创建通用JS
5. ✅ 创建数据文件模板
6. ✅ 校验：浏览器检查基础框架

### Phase 2: 核心页面（2天）
1. ✅ 主页（index.html）
   - 导航栏
   - Hero区
   - 卡片网格
   - 页脚
   - 校验：浏览器检查
   
2. ✅ 论文页（papers.html）
   - 筛选
   - 列表
   - 分页
   - 校验：浏览器检查
   
3. ✅ 项目页（projects.html）
   - 网格布局
   - 卡片
   - 校验：浏览器检查

### Phase 3: 内容页面（2天）
1. ✅ 日报页（daily.html）
   - 时间线
   - 校验：浏览器检查
   
2. ✅ 可可空间（keke/index.html）
   - 文章分类
   - 文章列表
   - 校验：浏览器检查

### Phase 4: 详细页面（2天）
1. ✅ 论文详情页
2. ✅ 项目详情页
3. ✅ 文章详情页
4. 校验：浏览器检查

### Phase 5: 优化与部署（1天）
1. ✅ 响应式优化
2. ✅ 性能优化
3. ✅ 部署到GitHub Pages
4. 校验：线上测试

---

## 🔄 数据更新流程

### 1. 新增论文
```bash
# 1. 编辑 data/papers.json
# 2. 提交到Git
# 3. 自动部署到GitHub Pages
```

### 2. 新增项目
```bash
# 1. 编辑 data/projects.json
# 2. 提交到Git
# 3. 自动部署到GitHub Pages
```

### 3. 新增日报
```bash
# 1. 编辑 data/daily.json
# 2. 提交到Git
# 3. 自动部署到GitHub Pages
```

### 4. 新增可可文章
```bash
# 1. 创建Markdown文件到 keke/articles/
# 2. 更新 data/keke/articles.json
# 3. 提交到Git
# 4. 自动部署到GitHub Pages
```

---

## 📊 进度追踪

### 文件：blog-html/PROGRESS.md
```markdown
# 博客系统开发进度

## Phase 1: 基础框架
- [ ] 创建目录结构
- [ ] 创建通用CSS
- [ ] 创建通用JS
- [ ] 创建数据文件

## Phase 2: 核心页面
- [ ] 主页
- [ ] 论文页
- [ ] 项目页

## Phase 3: 内容页面
- [ ] 日报页
- [ ] 可可空间

## Phase 4: 详细页面
- [ ] 论文详情
- [ ] 项目详情
- [ ] 文章详情

## Phase 5: 优化部署
- [ ] 响应式优化
- [ ] 性能优化
- [ ] 部署上线
```

每次心跳时：
1. 读取 PROGRESS.md
2. 检查已完成项
3. 测试页面显示
4. 记录问题
5. 更新进度

---

## 🎯 成功标准

### 1. 功能完整性
- ✅ 所有页面可访问
- ✅ 所有数据可加载
- ✅ 所有链接可点击

### 2. 显示正确性
- ✅ 布局正常
- ✅ 样式正常
- ✅ 响应式正常

### 3. 性能标准
- ✅ 首屏加载 < 2秒
- ✅ 数据加载 < 1秒
- ✅ 页面切换流畅

### 4. 可维护性
- ✅ 代码规范
- ✅ 文档完善
- ✅ 易于更新

---

_这个规划文档会持续更新_
