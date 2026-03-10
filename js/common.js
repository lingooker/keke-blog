/* ========================================
   博客系统通用工具
   创建时间：2026-03-11
   说明：导航、数据加载、渲染等工具函数
   ======================================== */

// ==================== BlogUtils工具类 ====================
class BlogUtils {
  
  // ==================== 导航栏 ====================
  static renderNavbar(activePage = 'home') {
    const pages = [
      { name: '首页', url: 'index.html', id: 'home' },
      { name: '论文', url: 'pages/papers.html', id: 'papers' },
      { name: '项目', url: 'pages/projects.html', id: 'projects' },
      { name: '日报', url: 'pages/daily.html', id: 'daily' },
      { name: '可可空间', url: 'keke/index.html', id: 'keke' }
    ];
    
    const menuHtml = pages.map(page => {
      const activeClass = page.id === activePage ? 'active' : '';
      return `<a href="${page.url}" class="${activeClass}">${page.name}</a>`;
    }).join('');
    
    return `
      <nav class="navbar">
        <div class="container">
          <a href="index.html" class="navbar-brand">林嘿嘿</a>
          <div class="navbar-menu">${menuHtml}</div>
        </div>
      </nav>
    `;
  }
  
  // ==================== 页脚 ====================
  static renderFooter() {
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer-links">
            <a href="https://github.com/lingooker">GitHub</a>
            <a href="mailto:example@example.com">Email</a>
          </div>
          <p>&copy; 2026 林嘿嘿. All rights reserved.</p>
        </div>
      </footer>
    `;
  }
  
  // ==================== 数据加载（带缓存） ====================
  static async loadData(url, cacheTime = 300000) { // 默认缓存5分钟
    const cacheKey = `cache_${url}`;
    const cached = DataCache.get(cacheKey);
    
    if (cached) {
      console.log(`[BlogUtils] 从缓存加载: ${url}`);
      return cached;
    }
    
    try {
      console.log(`[BlogUtils] 从网络加载: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      DataCache.set(cacheKey, data, cacheTime);
      return data;
    } catch (error) {
      console.error(`[BlogUtils] 加载失败: ${url}`, error);
      throw error;
    }
  }
  
  // ==================== 文章列表渲染 ====================
  static renderArticleList(articles, container) {
    if (!articles || articles.length === 0) {
      container.innerHTML = '<p class="error">暂无文章</p>';
      return;
    }
    
    const html = articles.map(article => this.renderArticleCard(article)).join('');
    container.innerHTML = `<div class="card-grid">${html}</div>`;
  }
  
  static renderArticleCard(article) {
    const tagsHtml = article.tags 
      ? article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')
      : '';
    
    return `
      <div class="card">
        <h3 class="card-title">${article.title}</h3>
        <p class="card-subtitle">${article.date || ''} ${article.author || ''}</p>
        <p class="card-text">${article.excerpt || ''}</p>
        ${tagsHtml ? `<div class="tags">${tagsHtml}</div>` : ''}
        <a href="${article.url}" class="btn btn-outline">阅读更多</a>
      </div>
    `;
  }
  
  // ==================== 论文卡片渲染 ====================
  static renderPaperCard(paper) {
    const tagsHtml = paper.tags 
      ? paper.tags.map(tag => `<span class="tag">${tag}</span>`).join('')
      : '';
    
    return `
      <div class="card">
        <h3 class="card-title">${paper.title}</h3>
        <p class="card-subtitle">${paper.authors ? paper.authors.join(', ') : ''} - ${paper.venue || ''} ${paper.year || ''}</p>
        <p class="card-text">${paper.abstract || ''}</p>
        ${tagsHtml ? `<div class="tags">${tagsHtml}</div>` : ''}
        <div style="margin-top: var(--spacing-sm);">
          ${paper.pdf ? `<a href="${paper.pdf}" class="btn">PDF</a>` : ''}
          ${paper.code ? `<a href="${paper.code}" class="btn btn-outline">Code</a>` : ''}
        </div>
      </div>
    `;
  }
  
  // ==================== 项目卡片渲染 ====================
  static renderProjectCard(project) {
    const techHtml = project.tech 
      ? project.tech.map(tech => `<span class="tag">${tech}</span>`).join('')
      : '';
    
    return `
      <div class="card">
        <h3 class="card-title">${project.title}</h3>
        <p class="card-subtitle">${project.status || ''}</p>
        <p class="card-text">${project.description || ''}</p>
        ${techHtml ? `<div class="tags">${techHtml}</div>` : ''}
        <div style="margin-top: var(--spacing-sm);">
          ${project.github ? `<a href="${project.github}" class="btn">GitHub</a>` : ''}
          ${project.demo ? `<a href="${project.demo}" class="btn btn-outline">Demo</a>` : ''}
        </div>
      </div>
    `;
  }
  
  // ==================== 日报渲染 ====================
  static renderDailyCard(report) {
    const tagsHtml = report.tags 
      ? report.tags.map(tag => `<span class="tag">${tag}</span>`).join('')
      : '';
    
    return `
      <div class="card">
        <h3 class="card-title">${report.title || report.date}</h3>
        <p class="card-subtitle">${report.date}</p>
        <p class="card-text">${report.content ? report.content.substring(0, 200) + '...' : ''}</p>
        ${tagsHtml ? `<div class="tags">${tagsHtml}</div>` : ''}
        <a href="pages/daily-detail.html?date=${report.date}" class="btn btn-outline">查看详情</a>
      </div>
    `;
  }
  
  // ==================== 分页 ====================
  static renderPagination(current, total, onPageChange) {
    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    let html = '<div class="pagination">';
    
    if (current > 1) {
      html += `<button class="btn btn-outline" onclick="${onPageChange}(${current - 1})">上一页</button>`;
    }
    
    for (let i = start; i <= end; i++) {
      const activeClass = i === current ? 'active' : '';
      html += `<button class="btn ${activeClass}" onclick="${onPageChange}(${i})">${i}</button>`;
    }
    
    if (current < total) {
      html += `<button class="btn btn-outline" onclick="${onPageChange}(${current + 1})">下一页</button>`;
    }
    
    html += '</div>';
    return html;
  }
  
  // ==================== 搜索 ====================
  static search(items, query, fields = ['title', 'description', 'tags']) {
    if (!query || query.trim() === '') {
      return items;
    }
    
    const searchTerms = query.toLowerCase().split(/\s+/);
    
    return items.filter(item => {
      const searchText = fields.map(field => {
        const value = item[field];
        if (Array.isArray(value)) {
          return value.join(' ');
        }
        return value || '';
      }).join(' ').toLowerCase();
      
      return searchTerms.every(term => searchText.includes(term));
    });
  }
  
  // ==================== 错误处理 ====================
  static showError(message, container = null) {
    const errorHtml = `<div class="error">${message}</div>`;
    
    if (container) {
      container.innerHTML = errorHtml;
    } else {
      document.body.insertAdjacentHTML('afterbegin', errorHtml);
    }
  }
  
  // ==================== 加载状态 ====================
  static showLoading(container) {
    container.innerHTML = `
      <div class="loading">
        <div class="loading-spinner"></div>
      </div>
    `;
  }
  
  // ==================== 格式化日期 ====================
  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // ==================== URL参数获取 ====================
  static getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
}

// ==================== 数据缓存 ====================
class DataCache {
  static get(key) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    try {
      const { data, timestamp, ttl } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        return data;
      } else {
        localStorage.removeItem(key);
        return null;
      }
    } catch {
      return null;
    }
  }
  
  static set(key, data, ttl = 300000) { // 默认5分钟
    const cached = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(key, JSON.stringify(cached));
  }
  
  static clear() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'));
    keys.forEach(key => localStorage.removeItem(key));
    console.log(`[DataCache] 已清除 ${keys.length} 个缓存`);
  }
}

// ==================== 导出（如果需要模块化） ====================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BlogUtils, DataCache };
}
