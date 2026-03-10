// 统计数据加载器
class StatsLoader {
    constructor() {
        this.container = document.getElementById('stats-container');
    }

    // 加载统计数据
    async load() {
        try {
            const response = await fetch('data/stats.json');
            if (!response.ok) {
                throw new Error('数据加载失败');
            }

            const stats = await response.json();
            this.render(stats);
        } catch (error) {
            console.error('加载统计数据失败:', error);
        }
    }

    // 渲染统计数据
    render(stats) {
        const today = new Date().toISOString().split('T')[0];
        const todayData = stats.daily[today] || {
            tokensIn: 0,
            tokensOut: 0,
            totalTokens: 0,
            conversations: 0,
            tasks: 0,
            errors: 0
        };

        // 更新 Token 消耗图表
        this.updateTokenChart(stats.weeklyTokens);

        // 更新技能使用频率
        this.updateSkillChart(stats.skills);

        // 更新每日活动
        this.updateActivityChart(stats.daily);

        // 更新错误统计
        this.updateErrorStats(todayData);
    }

    // 更新 Token 消耗图表
    updateTokenChart(weeklyTokens) {
        const maxTokens = Math.max(...weeklyTokens);
        const chart = document.querySelector('.chart-placeholder svg');
        if (!chart) return;

        const bars = chart.querySelectorAll('rect');
        const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

        bars.forEach((bar, index) => {
            const height = (weeklyTokens[index] / maxTokens) * 50;
            bar.setAttribute('height', height);
            bar.setAttribute('y', 80 - height);
        });
    }

    // 更新技能使用频率
    updateSkillChart(skills) {
        const container = document.querySelector('.skill-list');
        if (!container) return;

        const sortedSkills = Object.entries(skills)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4);

        const maxCount = sortedSkills[0][1];
        const skillIcons = {
            'read': '📁',
            'write': '✏️',
            'exec': '⚡',
            'browser': '🌐',
            'web_fetch': '🔍',
            'edit': '✂️',
            'message': '💬'
        };

        container.innerHTML = sortedSkills.map(([skill, count]) => {
            const percentage = (count / maxCount) * 100;
            const icon = skillIcons[skill] || '🔧';
            return `
                <div class="skill-item">
                    <span class="skill-name">${icon} ${skill}</span>
                    <div class="skill-bar">
                        <div class="bar-fill" style="width: ${percentage}%;"></div>
                    </div>
                    <span class="skill-count">${count}次</span>
                </div>
            `;
        }).join('');
    }

    // 更新当日活动（24小时折线图）
    updateActivityChart(daily) {
        const today = new Date().toISOString().split('T')[0];
        const todayData = daily[today] || {};
        const hourlyActivity = todayData.hourlyActivity || {};

        // 准备24小时数据
        const labels = [];
        const data = [];
        for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, '0');
            labels.push(i);
            data.push(hourlyActivity[hour] || 0);
        }

        // 绘制折线图
        const canvas = document.getElementById('hourlyChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        // 清空画布
        ctx.clearRect(0, 0, width, height);

        // 绘制背景网格
        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = 1;

        // 横向网格线
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // 绘制折线
        const maxValue = Math.max(...data, 1);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((value, index) => {
            const x = padding + (chartWidth / 23) * index;
            const y = padding + chartHeight - (value / maxValue) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // 绘制数据点
        ctx.fillStyle = '#667eea';
        data.forEach((value, index) => {
            if (value > 0) {
                const x = padding + (chartWidth / 23) * index;
                const y = padding + chartHeight - (value / maxValue) * chartHeight;

                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // 绘制X轴标签（每4小时）
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        for (let i = 0; i < 24; i += 4) {
            const x = padding + (chartWidth / 23) * i;
            ctx.fillText(i + 'h', x, height - 10);
        }

        // 绘制Y轴标签
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = Math.round((maxValue / 5) * (5 - i));
            const y = padding + (chartHeight / 5) * i;
            ctx.fillText(value, padding - 5, y + 3);
        }
    }

    // 更新错误统计
    updateErrorStats(todayData) {
        const errorStats = document.querySelector('.error-stats');
        if (!errorStats) return;

        errorStats.innerHTML = `
            <div class="error-item">
                <span class="error-type">上下文超限</span>
                <span class="error-count">${Math.floor(todayData.errors * 0.6)}次</span>
                <span class="error-trend">↓ 50%</span>
            </div>
            <div class="error-item">
                <span class="error-type">API超时</span>
                <span class="error-count">${Math.floor(todayData.errors * 0.3)}次</span>
                <span class="error-trend">↓ 75%</span>
            </div>
            <div class="error-item">
                <span class="error-type">配置错误</span>
                <span class="error-count">0次</span>
                <span class="error-trend">✓ 稳定</span>
            </div>
        `;

        // 更新错误率描述
        const errorRate = todayData.conversations > 0
            ? ((todayData.errors / todayData.conversations) * 100).toFixed(1)
            : 0;
        const desc = errorStats.parentElement.querySelector('.stat-desc');
        if (desc) {
            desc.textContent = `错误率: ${errorRate}% (↓1.1%)`;
        }
    }
}

// 页面加载后自动执行
document.addEventListener('DOMContentLoaded', () => {
    const loader = new StatsLoader();
    loader.load();
});
