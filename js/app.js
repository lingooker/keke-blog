// 博客工具函数

// 导航栏
function renderNav(active = '') {
  const pages = [
    { name: '首页', url: 'index.html', id: '' },
    { name: '可可空间', url: 'keke.html', id: 'keke' },
    { name: '论文', url: 'papers.html', id: 'papers' },
    { name: '项目', url: 'projects.html', id: 'projects' },
    { name: '日报', url: 'daily.html', id: 'daily' },
    { name: '关于', url: 'about.html', id: 'about' }
  ];

  const menu = pages.map(p =>
    `<a href="${p.url}" class="${p.id === active ? 'active' : ''}">${p.name}</a>`
  ).join('');

  return `
    <nav>
      <div class="container">
        <a href="index.html" class="brand">林嘿嘿</a>
        <div class="menu">${menu}</div>
      </div>
    </nav>
  `;
}

// 页脚
function renderFooter() {
  return `<footer>&copy; 2026 林嘿嘿</footer>`;
}

// 加载数据（带缓存）
async function loadData(url) {
  const cacheKey = `cache_${url}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    const { data, time } = JSON.parse(cached);
    if (Date.now() - time < 300000) return data; // 5分钟缓存
  }

  const res = await fetch(url);
  const data = await res.json();
  localStorage.setItem(cacheKey, JSON.stringify({ data, time: Date.now() }));
  return data;
}

// 渲染论文卡片
function renderPaper(paper) {
  const tags = paper.tags.map(t => `<span class="tag">${t}</span>`).join('');
  return `
    <div class="card">
      <h2>${paper.title}</h2>
      <p>${paper.venue} · ${paper.year}</p>
      <p>${paper.abstract}</p>
      <div>${tags}</div>
    </div>
  `;
}

// 渲染项目卡片
function renderProject(project) {
  const tech = project.tech.map(t => `<span class="tag">${t}</span>`).join('');
  return `
    <div class="card">
      <h2>${project.title}</h2>
      <p>${project.status}</p>
      <p>${project.description}</p>
      <div>${tech}</div>
    </div>
  `;
}

// 渲染日报
function renderReport(report) {
  const tags = report.tags.map(t => `<span class="tag">${t}</span>`).join('');
  return `
    <div class="card">
      <h2>${report.date} · ${report.title}</h2>
      <p>${report.content}</p>
      <div>${tags}</div>
    </div>
  `;
}
