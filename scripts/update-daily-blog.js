#!/usr/bin/env node

/**
 * 博客每日更新脚本
 *
 * 功能：
 * 1. 从 autonomous-learning/reports/ 读取早报/晚报
 * 2. 从 .learnings/ 读取学习记录
 * 3. 更新 daily.html 和 learnings.html
 * 4. 更新统计数据
 *
 * 执行时间：每天晚上 00:00
 */

const fs = require('fs');
const path = require('path');

// 文件路径
const BLOG_DIR = path.join(__dirname, '..');
const REPORTS_DIR = path.join(__dirname, '../../autonomous-learning/reports');
const LEARNINGS_DIR = path.join(__dirname, '../../.learnings');
const MEMORY_DIR = path.join(__dirname, '../../memory');

// 获取当前日期
function getToday() {
    return new Date().toISOString().split('T')[0];
}

// 读取文件（安全）
function safeRead(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf-8');
        }
    } catch (error) {
        console.error(`读取文件失败: ${filePath}`, error.message);
    }
    return '';
}

// 更新 daily.html
function updateDailyPage() {
    const today = getToday();
    const morningReport = safeRead(path.join(REPORTS_DIR, `${today}-morning.md`));
    const eveningReport = safeRead(path.join(REPORTS_DIR, `${today}-evening.md`));

    if (!morningReport && !eveningReport) {
        console.log('今天还没有日报，跳过更新');
        return;
    }

    // 读取模板
    let dailyHtml = safeRead(path.join(BLOG_DIR, 'pages/daily.html'));

    if (!dailyHtml) {
        console.error('无法读取 daily.html 模板');
        return;
    }

    // 更新内容区域
    const contentSection = `
        <div class="report-section">
            <h2>📊 ${today} 日报</h2>
            ${morningReport ? `
            <div class="morning-report">
                <h3>🌅 早报</h3>
                <pre>${morningReport}</pre>
            </div>
            ` : '<p>早报尚未生成</p>'}
            ${eveningReport ? `
            <div class="evening-report">
                <h3>🌙 晚报</h3>
                <pre>${eveningReport}</pre>
            </div>
            ` : '<p>晚报尚未生成</p>'}
        </div>
    `;

    // 替换内容（假设模板中有 <!-- DAILY_CONTENT --> 标记）
    dailyHtml = dailyHtml.replace(/<!-- DAILY_CONTENT -->[\s\S]*?<!-- END_DAILY_CONTENT -->/,
        `<!-- DAILY_CONTENT -->${contentSection}<!-- END_DAILY_CONTENT -->`);

    // 保存
    fs.writeFileSync(path.join(BLOG_DIR, 'pages/daily.html'), dailyHtml, 'utf-8');
    console.log('✅ daily.html 已更新');
}

// 更新 learnings.html
function updateLearningsPage() {
    const learnings = safeRead(path.join(LEARNINGS_DIR, 'LEARNINGS.md'));
    const errors = safeRead(path.join(LEARNINGS_DIR, 'ERRORS.md'));

    if (!learnings && !errors) {
        console.log('没有学习记录，跳过更新');
        return;
    }

    // 读取模板
    let learningsHtml = safeRead(path.join(BLOG_DIR, 'pages/learnings.html'));

    if (!learningsHtml) {
        console.error('无法读取 learnings.html 模板');
        return;
    }

    // 更新内容区域
    const contentSection = `
        <div class="learnings-section">
            <h2>📚 学习记录</h2>
            ${learnings ? `
            <div class="learnings">
                <pre>${learnings}</pre>
            </div>
            ` : '<p>暂无学习记录</p>'}

            <h2>❌ 错误记录</h2>
            ${errors ? `
            <div class="errors">
                <pre>${errors}</pre>
            </div>
            ` : '<p>暂无错误记录</p>'}
        </div>
    `;

    // 替换内容
    learningsHtml = learningsHtml.replace(/<!-- LEARNINGS_CONTENT -->[\s\S]*?<!-- END_LEARNINGS_CONTENT -->/,
        `<!-- LEARNINGS_CONTENT -->${contentSection}<!-- END_LEARNINGS_CONTENT -->`);

    // 保存
    fs.writeFileSync(path.join(BLOG_DIR, 'pages/learnings.html'), learningsHtml, 'utf-8');
    console.log('✅ learnings.html 已更新');
}

// 更新统计数据
function updateStats() {
    const today = getToday();
    const memoryFile = path.join(MEMORY_DIR, `${today}.md`);

    // 读取今天的记忆文件
    const memory = safeRead(memoryFile);

    // 统计数据
    const stats = {
        date: today,
        lastUpdate: new Date().toISOString(),
        sections: {
            completedTasks: (memory.match(/✅/g) || []).length,
            totalLines: memory.split('\n').length,
            fileSize: memory.length
        }
    };

    // 保存到 data/stats.json
    const statsFile = path.join(BLOG_DIR, 'data', 'stats.json');
    let allStats = {};

    if (fs.existsSync(statsFile)) {
        allStats = JSON.parse(fs.readFileSync(statsFile, 'utf-8'));
    }

    if (!allStats.daily) {
        allStats.daily = {};
    }

    allStats.daily[today] = stats;
    allStats.lastUpdate = new Date().toISOString();

    fs.writeFileSync(statsFile, JSON.stringify(allStats, null, 2), 'utf-8');
    console.log('✅ 统计数据已更新');
}

// 主函数
function main() {
    console.log('=== 开始更新博客 ===');
    console.log(`时间: ${new Date().toISOString()}`);
    console.log('');

    // 1. 更新 daily.html
    console.log('1. 更新 daily.html...');
    updateDailyPage();

    // 2. 更新 learnings.html
    console.log('\n2. 更新 learnings.html...');
    updateLearningsPage();

    // 3. 更新统计数据
    console.log('\n3. 更新统计数据...');
    updateStats();

    console.log('\n=== 博客更新完成 ===');
}

// 执行
main();
