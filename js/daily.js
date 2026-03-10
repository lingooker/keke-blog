// 日报数据加载器（支持日期切换）
class DailyLoader {
    constructor() {
        this.container = document.getElementById('daily-content');
        this.titleEl = document.getElementById('daily-title');
        this.dateDisplay = document.getElementById('current-date');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');

        this.currentDate = new Date();
        this.today = new Date();
        this.availableDates = [];
    }

    // 格式化日期
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`;
    }

    // 日期转字符串 YYYY-MM-DD
    dateToString(date) {
        return date.toISOString().split('T')[0];
    }

    // 获取类型图标
    getTypeIcon(type) {
        const icons = {
            'news': '📰',
            'tech': '💻',
            'project': '🎯',
            'config': '⚙️',
            'improvement': '✨',
            'evolution': '🧠',
            'fix': '🔧'
        };
        return icons[type] || '📌';
    }

    // 获取类型名称
    getTypeName(type) {
        const names = {
            'news': '大模型动态',
            'tech': '技术趋势',
            'project': '项目进展',
            'config': '系统配置',
            'improvement': '优化改进',
            'evolution': '自我进化',
            'fix': '问题修复'
        };
        return names[type] || '其他';
    }

    // 按类型分组
    groupByType(items) {
        const groups = {};
        items.forEach(item => {
            const type = item.type || 'other';
            if (!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(item);
        });
        return groups;
    }

    // 渲染单个条目
    renderItem(item) {
        const importanceClass = item.importance === 'high' ? 'high-importance' : '';
        const tags = item.tags ? item.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';

        return `
            <div class="item ${importanceClass}">
                <h4>${item.title}</h4>
                <p>${item.summary}</p>
                <div class="meta">
                    ${tags}
                    ${item.note ? `<span class="note">💡 ${item.note}</span>` : ''}
                </div>
            </div>
        `;
    }

    // 渲染分类
    renderCategory(typeName, icon, items) {
        const itemsHtml = items.map(item => this.renderItem(item)).join('');
        return `
            <div class="category">
                <h3>${icon} ${typeName}</h3>
                ${itemsHtml}
            </div>
        `;
    }

    // 渲染日报
    renderDaily(data) {
        // 更新日期显示
        this.dateDisplay.textContent = this.formatDate(data.date);
        this.titleEl.textContent = `📅 ${this.formatDate(data.date)}`;

        // 合并所有条目
        const allItems = [];
        data.collections.forEach(collection => {
            collection.items.forEach(item => {
                allItems.push({
                    ...item,
                    time: collection.time,
                    source: collection.source
                });
            });
        });

        // 按类型分组
        const groups = this.groupByType(allItems);

        // 渲染各分类
        let html = '';
        const typeOrder = ['news', 'tech', 'project', 'config', 'improvement', 'evolution', 'fix'];

        typeOrder.forEach(type => {
            if (groups[type] && groups[type].length > 0) {
                const icon = this.getTypeIcon(type);
                const typeName = this.getTypeName(type);
                html += this.renderCategory(typeName, icon, groups[type]);
            }
        });

        // 渲染其他未分类的
        Object.keys(groups).forEach(type => {
            if (!typeOrder.includes(type) && groups[type].length > 0) {
                const icon = this.getTypeIcon(type);
                const typeName = this.getTypeName(type);
                html += this.renderCategory(typeName, icon, groups[type]);
            }
        });

        this.container.innerHTML = html;

        // 更新按钮状态
        this.updateNavButtons();
    }

    // 更新导航按钮状态
    updateNavButtons() {
        // 如果是今天，禁用"后一天"按钮
        this.nextBtn.disabled = this.dateToString(this.currentDate) === this.dateToString(this.today);
    }

    // 加载数据
    async load(date = null) {
        try {
            // 如果没有指定日期，使用当前日期
            if (date) {
                this.currentDate = new Date(date);
            }

            const targetDate = this.dateToString(this.currentDate);
            const url = `data/daily/${targetDate}.json`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('数据加载失败');
            }

            const data = await response.json();
            this.renderDaily(data);
        } catch (error) {
            console.error('加载日报失败:', error);
            this.dateDisplay.textContent = this.formatDate(this.currentDate);
            this.titleEl.textContent = `📅 ${this.formatDate(this.currentDate)}`;
            this.container.innerHTML = `
                <div class="error-message">
                    <p>😔 暂无该日期的日报数据</p>
                    <p style="font-size: 0.9rem; color: #999; margin-top: 1rem;">
                        林可可每天晚上11点自动生成日报
                    </p>
                </div>
            `;
            this.updateNavButtons();
        }
    }

    // 前一天
    loadPrevDay() {
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        this.load();
    }

    // 后一天
    loadNextDay() {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        this.load();
    }

    // 加载往期日报列表
    async loadArchive() {
        const archiveGrid = document.getElementById('archive-grid');

        try {
            // 尝试加载索引文件
            const response = await fetch('data/daily/index.json');
            let dates = [];

            if (response.ok) {
                const data = await response.json();
                dates = data.dates || [];
            } else {
                // 如果没有索引，显示今天的
                dates = [this.dateToString(this.today)];
            }

            this.availableDates = dates;

            if (dates.length === 0) {
                archiveGrid.innerHTML = '<p style="text-align: center; color: #666;">暂无往期日报</p>';
                return;
            }

            // 渲染往期列表
            const html = dates.map(date => `
                <div class="archive-item" onclick="loadDaily('${date}')">
                    <div class="archive-date">📅 ${this.formatDate(date)}</div>
                    <div class="archive-stats">点击查看详情 →</div>
                </div>
            `).join('');

            archiveGrid.innerHTML = html;
        } catch (error) {
            console.error('加载往期失败:', error);
            archiveGrid.innerHTML = '<p style="text-align: center; color: #666;">加载失败</p>';
        }
    }
}

// 全局实例
let dailyLoader;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    dailyLoader = new DailyLoader();
    dailyLoader.load();
});

// 加载指定日期
function loadDaily(date) {
    dailyLoader.load(date);
    // 隐藏往期列表
    document.getElementById('archive-section').classList.remove('show');
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 前一天
function loadPrevDay() {
    dailyLoader.loadPrevDay();
}

// 后一天
function loadNextDay() {
    dailyLoader.loadNextDay();
}

// 切换往期显示
function toggleArchive() {
    const section = document.getElementById('archive-section');
    section.classList.toggle('show');

    if (section.classList.contains('show')) {
        dailyLoader.loadArchive();
    }
}
