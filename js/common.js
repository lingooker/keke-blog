/**
 * 统一工具函数 - 所有页面复用
 */

// ==================== 配置 ====================
const CONFIG = {
    // 每页显示数量
    PAGE_SIZE: 10,

    // 数据路径
    DATA_PATHS: {
        dailyReports: 'data/daily-reports.json',
        kekeArticles: 'data/keke-articles.json'
    },

    // 文章路径
    ARTICLE_PATHS: {
        daily: 'daily-reports',
        diary: 'keke-articles',
        reading: 'keke-articles',
        learning: 'keke-articles',
        thoughts: 'keke-articles'
    },

    // 分类名称映射
    CATEGORY_NAMES: {
        daily: '日报',
        diary: '日记',
        reading: '阅读',
        learning: '学习',
        thoughts: '感悟'
    },

    // 分类图标
    CATEGORY_ICONS: {
        daily: '📊',
        diary: '📔',
        reading: '📖',
        learning: '🎓',
        thoughts: '💭'
    }
};

// ==================== URL 参数 ====================

/**
 * 获取 URL 参数
 */
function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * 设置 URL 参数（不刷新页面）
 */
function setUrlParam(key, value) {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url);
}

// ==================== 数据加载 ====================

/**
 * 加载 JSON 数据（带缓存）
 */
const DataCache = {
    cache: new Map(),
    maxAge: 5 * 60 * 1000, // 5分钟缓存

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() - item.timestamp > this.maxAge) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    },

    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    },

    clear() {
        this.cache.clear();
    }
};

/**
 * 加载文章索引（支持分页）
 */
async function loadArticleIndex(type, page = 1, pageSize = CONFIG.PAGE_SIZE) {
    const cacheKey = `index_${type}`;

    // 尝试从缓存读取
    let data = DataCache.get(cacheKey);

    if (!data) {
        try {
            const path = type === 'daily'
                ? CONFIG.DATA_PATHS.dailyReports
                : CONFIG.DATA_PATHS.kekeArticles;

            const response = await fetch(path);
            if (!response.ok) {
                throw new Error('数据加载失败');
            }

            data = await response.json();
            DataCache.set(cacheKey, data);
        } catch (error) {
            console.error('加载索引失败:', error);
            return { articles: [], total: 0, hasMore: false };
        }
    }

    const allArticles = data.articles || [];

    // 分页
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const articles = allArticles.slice(startIndex, endIndex);

    return {
        articles,
        total: allArticles.length,
        hasMore: endIndex < allArticles.length,
        page,
        pageSize
    };
}

/**
 * 获取单篇文章信息
 */
async function getArticleInfo(id) {
    const type = id.match(/^\d{4}-\d{2}-\d{2}$/) ? 'daily' : 'keke';
    const cacheKey = `index_${type}`;

    let data = DataCache.get(cacheKey);

    if (!data) {
        const path = type === 'daily'
            ? CONFIG.DATA_PATHS.dailyReports
            : CONFIG.DATA_PATHS.kekeArticles;

        const response = await fetch(path);
        if (!response.ok) {
            throw new Error('数据加载失败');
        }

        data = await response.json();
        DataCache.set(cacheKey, data);
    }

    return data.articles.find(a => a.id === id);
}

/**
 * 加载 Markdown 内容
 */
async function loadMarkdownContent(id) {
    const article = await getArticleInfo(id);
    if (!article) {
        throw new Error('文章不存在');
    }

    const category = article.category;
    const folder = CONFIG.ARTICLE_PATHS[category];

    let mdPath;
    if (category === 'daily') {
        mdPath = `${folder}/${id}.md`;
    } else {
        mdPath = `${folder}/${id}.md`;
    }

    // 根据当前页面位置调整路径
    const currentPage = window.location.pathname;
    if (currentPage.includes('/pages/')) {
        mdPath = `../${mdPath}`;
    }

    const response = await fetch(mdPath);
    if (!response.ok) {
        throw new Error('Markdown 文件加载失败');
    }

    const mdContent = await response.text();

    // 解析 YAML 头部
    const { metadata, content } = parseMarkdownWithYAML(mdContent);

    return {
        article,
        metadata,
        content
    };
}

/**
 * 解析 Markdown（去掉 YAML 头部）
 */
function parseMarkdownWithYAML(mdContent) {
    const yamlRegex = /^---\n([\s\S]*?)\n---\n/;
    const match = mdContent.match(yamlRegex);

    if (!match) {
        return {
            metadata: {},
            content: mdContent
        };
    }

    const yamlStr = match[1];
    const content = mdContent.replace(yamlRegex, '');

    // 简单解析 YAML（仅支持基本格式）
    const metadata = {};
    yamlStr.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();

            // 处理数组
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.substring(1, value.length - 1)
                    .split(',')
                    .map(s => s.trim());
            }

            metadata[key] = value;
        }
    });

    return { metadata, content };
}

// ==================== 文章卡片渲染 ====================

/**
 * 渲染文章卡片
 */
function renderArticleCard(article, basePath = 'pages') {
    const categoryName = CONFIG.CATEGORY_NAMES[article.category] || article.category;
    const detailUrl = `${basePath}/article.html?id=${article.id}`;

    return `
        <div class="article-card" onclick="window.location.href='${detailUrl}'">
            <div class="article-content">
                <div class="article-meta">
                    <div class="article-date">
                        <span>📅</span>
                        <span>${article.date}</span>
                    </div>
                    <span class="article-category">${categoryName}</span>
                </div>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <a href="${detailUrl}" class="read-more">阅读全文 →</a>
            </div>
        </div>
    `;
}

/**
 * 渲染文章列表（带分页）
 */
function renderArticleList(container, articles, basePath = 'pages') {
    if (articles.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>没有文章</h2>
                <p>暂无内容，敬请期待～</p>
            </div>
        `;
        return;
    }

    container.innerHTML = articles
        .map(article => renderArticleCard(article, basePath))
        .join('');
}

// ==================== 加载更多功能 ====================

/**
 * 创建加载更多管理器
 */
function createLoadMoreManager(container, loadFn, basePath = 'pages') {
    let currentPage = 1;
    let isLoading = false;
    let hasMore = true;

    return {
        async loadMore() {
            if (isLoading || !hasMore) return;

            isLoading = true;

            // 显示加载状态
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading';
            loadingDiv.innerHTML = '<div class="loading-spinner"></div>';
            container.appendChild(loadingDiv);

            try {
                const result = await loadFn(currentPage);

                if (result.articles.length > 0) {
                    const cards = result.articles
                        .map(article => renderArticleCard(article, basePath))
                        .join('');
                    container.insertAdjacentHTML('beforeend', cards);
                }

                hasMore = result.hasMore;
                currentPage++;

                // 移除加载状态
                loadingDiv.remove();

                // 如果还有更多，显示加载更多按钮
                if (hasMore) {
                    this.showLoadMoreButton();
                } else {
                    this.hideLoadMoreButton();
                }
            } catch (error) {
                console.error('加载失败:', error);
                loadingDiv.remove();
            } finally {
                isLoading = false;
            }
        },

        showLoadMoreButton() {
            let btnContainer = document.querySelector('.load-more');
            if (!btnContainer) {
                btnContainer = document.createElement('div');
                btnContainer.className = 'load-more';
                btnContainer.innerHTML = '<button class="load-more-btn">加载更多</button>';
                container.appendChild(btnContainer);

                btnContainer.querySelector('button').addEventListener('click', () => {
                    this.loadMore();
                });
            }
        },

        hideLoadMoreButton() {
            const btnContainer = document.querySelector('.load-more');
            if (btnContainer) {
                btnContainer.remove();
            }
        },

        reset() {
            currentPage = 1;
            hasMore = true;
            container.innerHTML = '';
            DataCache.clear();
        }
    };
}

// ==================== 导航栏生成 ====================

/**
 * 生成统一导航栏
 */
function renderNavbar(activePage = '', title = '', isKeke = false) {
    const pages = [
        { id: 'index', name: '首页', href: isKeke ? 'index.html' : '../index.html' },
        { id: 'projects', name: '项目', href: isKeke ? 'pages/projects.html' : 'projects.html' },
        { id: 'papers', name: '论文', href: isKeke ? 'pages/papers.html' : 'papers.html' },
        { id: 'daily', name: '日报', href: isKeke ? 'pages/daily.html' : 'daily.html' },
        { id: 'skills', name: '技能', href: isKeke ? 'pages/skills.html' : 'skills.html' },
        { id: 'keke', name: '可可空间', href: isKeke ? 'keke.html' : '../keke.html' }
    ];

    const navLinks = pages.map(page => {
        const isActive = page.id === activePage ? 'style="color: #667eea; font-weight: 600;"' : '';
        return `<li><a href="${page.href}" ${isActive}>${page.name}</a></li>`;
    }).join('');

    const logoHref = isKeke ? 'index.html' : '../index.html';
    const titleHtml = title ? `<span class="nav-title">${title}</span>` : '';

    return `
        <header>
            <nav>
                <a href="${logoHref}" class="logo">林海</a>
                ${titleHtml}
                <ul class="nav-links">
                    ${navLinks}
                </ul>
            </nav>
        </header>
    `;
}

/**
 * 生成页脚
 */
function renderFooter() {
    return `
        <footer>
            <p>© 2026 林海的个人博客 | 由 <a href="https://openclaw.ai" target="_blank">OpenClaw</a> 驱动</p>
        </footer>
    `;
}

// ==================== 错误处理 ====================

/**
 * 显示错误信息
 */
function showError(container, message, showBackLink = true) {
    container.innerHTML = `
        <div class="empty-state">
            <h2>出错了</h2>
            <p>${message}</p>
            ${showBackLink ? '<a href="javascript:history.back()" class="back-link">← 返回</a>' : ''}
        </div>
    `;
}

/**
 * 显示加载状态
 */
function showLoading(container) {
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
        </div>
    `;
}

// ==================== 懒加载（滚动到底部自动加载） ====================

/**
 * 设置滚动懒加载
 */
function setupLazyLoad(manager) {
    let isLoading = false;

    window.addEventListener('scroll', () => {
        if (isLoading) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // 距离底部 200px 时触发
        if (scrollTop + windowHeight >= documentHeight - 200) {
            isLoading = true;
            manager.loadMore().finally(() => {
                isLoading = false;
            });
        }
    });
}

// ==================== 导出 ====================

// 如果在浏览器环境，挂载到 window
if (typeof window !== 'undefined') {
    window.BlogUtils = {
        CONFIG,
        getUrlParam,
        setUrlParam,
        loadArticleIndex,
        getArticleInfo,
        loadMarkdownContent,
        renderArticleCard,
        renderArticleList,
        renderNavbar,
        renderFooter,
        showError,
        showLoading,
        createLoadMoreManager,
        setupLazyLoad,
        DataCache
    };
}