# 博客目录重构方案

## 当前问题
1. 所有 HTML 文件都在根目录，很乱
2. JS、CSS、数据文件混杂
3. 没有按功能分类

## 新的目录结构

```
blog-html/
├── index.html              # 主页
│
├── css/                    # 样式文件
│   ├── style.css          # 通用样式
│   ├── keke.css           # 可可空间样式
│   └── ...
│
├── js/                     # JavaScript 文件
│   ├── daily.js
│   ├── skills.js
│   ├── stats.js
│   └── common.js          # 通用函数
│
├── data/                   # 数据文件
│   ├── data.json          # 主页数据
│   ├── skills.json        # 技能数据
│   ├── stats.json         # 统计数据
│   ├── keke-articles.json # 可可文章索引
│   └── daily/             # 日报数据
│       └── YYYY-MM-DD.json
│
├── pages/                  # 页面（二级页面）
│   ├── daily.html         # 日报
│   ├── skills.html        # 技能
│   ├── learnings.html     # 学习记录
│   ├── projects.html      # 项目列表
│   └── papers.html        # 论文列表
│
├── keke/                   # 可可空间（独立模块）
│   ├── index.html         # 可可主页
│   ├── articles/          # 文章存放
│   │   ├── keke-001.html
│   │   ├── keke-001.md
│   │   └── ...
│   ├── diary/             # 日记（未来）
│   ├── reading/           # 阅读（未来）
│   ├── learning/          # 学习（未来）
│   └── thoughts/          # 感悟（未来）
│
├── about/                  # 关于页面
│   ├── keke.html          # 关于可可
│   └── lin.html           # 关于林嘿嘿
│
├── projects/               # 项目详情页
│   ├── blog-system.html
│   ├── daily-system.html
│   └── ...
│
├── papers/                 # 论文详情页
│   ├── iclr-2026.html
│   └── ...
│
├── images/                 # 图片资源
│   ├── avatar.jpg
│   └── keke-avatar.png
│
├── scripts/                # 维护脚本
│   ├── update-all.js
│   ├── update-stats.js
│   ├── scan-skills.js
│   └── ...
│
└── docs/                   # 文档
    └── DAILY-UPDATE-SPEC.md
```

## 分类说明

### 1. 按文件类型分类
- `css/` - 所有样式文件
- `js/` - 所有 JavaScript 文件
- `data/` - 所有数据文件
- `images/` - 所有图片资源

### 2. 按功能模块分类
- `pages/` - 主要页面
- `keke/` - 可可空间（独立模块）
- `about/` - 关于页面
- `projects/` - 项目详情
- `papers/` - 论文详情

### 3. 按职责分类
- `scripts/` - 维护脚本
- `docs/` - 文档

## 迁移步骤

### 第一步：创建目录
```bash
mkdir css, js, data, pages, keke, about, projects, papers, images, scripts, docs
```

### 第二步：移动文件
```bash
# CSS 文件
Move-Item *.css css/

# JS 文件
Move-Item *.js js/

# 数据文件
Move-Item *.json data/
Move-Item data/* data/

# 页面文件
Move-Item daily.html, skills.html, learnings.html, projects.html, papers.html pages/

# 可可空间
Move-Item keke.html keke/index.html
Move-Item keke-articles/* keke/articles/

# 关于页面
Move-Item about-*.html about/

# 项目详情
Move-Item projects/*.html projects/

# 论文详情
Move-Item papers/*.html papers/

# 图片
Move-Item images/* images/

# 脚本
Move-Item update-*.js, scan-skills.js scripts/

# 文档
Move-Item *.md docs/
```

### 第三步：更新链接
需要更新所有 HTML 文件中的链接：
- CSS 引用：`href="css/style.css"`
- JS 引用：`src="js/common.js"`
- 数据引用：`src="data/skills.json"`

## 好处

1. **清晰**：按功能分类，一目了然
2. **易维护**：相关文件放在一起
3. **可扩展**：新增模块时知道放哪里
4. **标准化**：符合 Web 项目规范
5. **协作友好**：别人也能快速理解结构

## 注意事项

1. **更新路径**：移动文件后要更新所有引用
2. **测试**：移动后要测试所有页面是否正常
3. **Git**：用 `git mv` 保留文件历史
4. **分步**：不要一次性移动太多，分步进行

---

_好的目录结构是项目成功的一半！_
