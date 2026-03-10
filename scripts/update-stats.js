// 每日统计数据更新脚本（一天一次）
const fs = require('fs');
const path = require('path');

const statsFile = path.join(__dirname, 'data', 'stats.json');

// 获取当前日期
function getToday() {
    return new Date().toISOString().split('T')[0];
}

// 读取现有数据
function loadStats() {
    if (fs.existsSync(statsFile)) {
        return JSON.parse(fs.readFileSync(statsFile, 'utf-8'));
    }
    return {
        lastUpdate: new Date().toISOString(),
        daily: {},
        skills: {}
    };
}

// 保存数据
function saveStats(stats) {
    stats.lastUpdate = new Date().toISOString();
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2), 'utf-8');
}

// 每日更新（从 session_status 解析）
function dailyUpdate(statusText) {
    const stats = loadStats();
    const today = getToday();

    // 如果今天已经更新过，跳过
    if (stats.daily[today] && stats.daily[today].updated) {
        console.log('今天已更新，跳过');
        return stats;
    }

    console.log('开始每日统计更新...');

    // 确保今天的数据存在
    if (!stats.daily[today]) {
        stats.daily[today] = {
            tokensIn: 0,
            tokensOut: 0,
            totalTokens: 0,
            conversations: 0,
            tasks: 0,
            errors: 0,
            hourlyActivity: {},
            updated: false
        };
    }

    // 解析 session_status 输出
    // 格式: Tokens: 44k in / 3.1k out
    const tokensMatch = statusText.match(/Tokens:\s+([\d.]+)k?\s+in\s+\/\s+([\d.]+)k?\s+out/i);
    if (tokensMatch) {
        const tokensIn = parseFloat(tokensMatch[1]) * 1000;
        const tokensOut = parseFloat(tokensMatch[2]) * 1000;
        stats.daily[today].tokensIn = Math.round(tokensIn);
        stats.daily[today].tokensOut = Math.round(tokensOut);
        stats.daily[today].totalTokens = Math.round(tokensIn + tokensOut);
    }

    // 标记今天已更新
    stats.daily[today].updated = true;

    saveStats(stats);
    console.log('每日统计更新完成:', stats.daily[today]);
    return stats;
}

// 记录技能使用（每次调用时累加）
function recordSkillUsage(skillName) {
    const stats = loadStats();

    if (!stats.skills[skillName]) {
        stats.skills[skillName] = 0;
    }
    stats.skills[skillName]++;

    saveStats(stats);
    console.log(`技能使用: ${skillName} (累计${stats.skills[skillName]}次)`);
}

// 记录小时活动（每次心跳时记录）
function recordHourlyActivity() {
    const stats = loadStats();
    const today = getToday();
    const hour = new Date().getHours().toString().padStart(2, '0');

    // 确保今天的数据存在
    if (!stats.daily[today]) {
        stats.daily[today] = {
            tokensIn: 0,
            tokensOut: 0,
            totalTokens: 0,
            hourlyActivity: {},
            updated: false
        };
    }

    // 初始化 hourlyActivity
    if (!stats.daily[today].hourlyActivity) {
        stats.daily[today].hourlyActivity = {};
    }

    // 记录当前小时的活动
    if (!stats.daily[today].hourlyActivity[hour]) {
        stats.daily[today].hourlyActivity[hour] = 0;
    }
    stats.daily[today].hourlyActivity[hour]++;

    saveStats(stats);
}

// 获取统计数据
function getStats() {
    return loadStats();
}

// 导出
module.exports = {
    dailyUpdate,
    recordSkillUsage,
    recordHourlyActivity,
    getStats
};

// 如果直接运行，显示当前统计
if (require.main === module) {
    const stats = getStats();
    console.log(JSON.stringify(stats, null, 2));
}
