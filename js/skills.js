// 技能数据加载器
class SkillsLoader {
    constructor() {
        this.container = document.getElementById('skills-grid');
        this.searchInput = document.getElementById('skill-search');
        this.statsContainer = document.getElementById('skills-stats');
    }

    // 渲染单个技能卡片
    renderSkill(skill) {
        return `
            <a href="skill-detail.html?name=${encodeURIComponent(skill.folder)}" class="skill-card">
                <div class="skill-name">${skill.name}</div>
                <p class="skill-desc">${skill.description.substring(0, 100)}${skill.description.length > 100 ? '...' : ''}</p>
                <div class="skill-footer">
                    <span class="skill-folder">📁 ${skill.folder}</span>
                    <span class="skill-arrow">→</span>
                </div>
            </a>
        `;
    }

    // 渲染统计信息
    renderStats(total) {
        if (this.statsContainer) {
            this.statsContainer.innerHTML = `
                <div class="stat-item">
                    <span class="stat-number">${total}</span>
                    <span class="stat-label">个技能</span>
                </div>
            `;
        }
    }

    // 渲染所有技能
    renderSkills(skills) {
        const html = skills.map(skill => this.renderSkill(skill)).join('');
        this.container.innerHTML = html;
        this.renderStats(skills.length);
    }

    // 搜索过滤
    filterSkills(skills, query) {
        if (!query) return skills;

        const lowerQuery = query.toLowerCase();
        return skills.filter(skill =>
            skill.name.toLowerCase().includes(lowerQuery) ||
            skill.description.toLowerCase().includes(lowerQuery) ||
            skill.folder.toLowerCase().includes(lowerQuery)
        );
    }

    // 加载数据
    async load() {
        try {
            const response = await fetch('data/skills.json');
            if (!response.ok) {
                throw new Error('数据加载失败');
            }

            const skills = await response.json();
            this.allSkills = skills;
            this.renderSkills(skills);

            // 绑定搜索
            if (this.searchInput) {
                this.searchInput.addEventListener('input', (e) => {
                    const query = e.target.value;
                    const filtered = this.filterSkills(this.allSkills, query);
                    this.renderSkills(filtered);
                });
            }
        } catch (error) {
            console.error('加载技能失败:', error);
            this.container.innerHTML = `
                <div class="error-message">
                    <p>😔 暂无技能数据</p>
                    <p style="font-size: 0.9rem; color: #999; margin-top: 1rem;">
                        请运行 node scan-skills.js 生成技能数据
                    </p>
                </div>
            `;
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const loader = new SkillsLoader();
    loader.load();
});
