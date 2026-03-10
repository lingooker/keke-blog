#!/usr/bin/env node

/**
 * 博客全量更新脚本
 * 
 * 执行时间：每天凌晨 1:00
 * 功能：依次执行所有更新任务
 * 
 * 更新顺序：
 * 1. 扫描技能列表
 * 2. 更新统计数据
 * 3. 更新日报和学习记录
 * 4. 更新主页数据
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BLOG_DIR = __dirname;
const LOG_DIR = path.join(__dirname, '..', 'log', 'blog-update');

// 确保日志目录存在
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// 获取时间戳
function getTimestamp() {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

// 日志函数
function log(message) {
    const timestamp = getTimestamp();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    
    // 写入日志文件
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(LOG_DIR, `${today}.log`);
    fs.appendFileSync(logFile, logMessage + '\n', 'utf-8');
}

// 执行脚本
function runScript(scriptName, description) {
    log(`\n=== 开始: ${description} ===`);
    
    try {
        const scriptPath = path.join(BLOG_DIR, scriptName);
        const output = execSync(`node "${scriptPath}"`, {
            encoding: 'utf-8',
            timeout: 60000 // 60秒超时
        });
        
        log(output.trim());
        log(`✅ ${description} 完成`);
        return true;
    } catch (error) {
        log(`❌ ${description} 失败: ${error.message}`);
        if (error.stdout) {
            log(`输出: ${error.stdout}`);
        }
        if (error.stderr) {
            log(`错误: ${error.stderr}`);
        }
        return false;
    }
}

// 主函数
function main() {
    log('========================================');
    log('博客日常更新开始');
    log('========================================');
    
    const results = [];
    
    // 1. 扫描技能列表
    results.push({
        name: '扫描技能列表',
        success: runScript('scan-skills.js', '扫描技能列表')
    });
    
    // 2. 更新统计数据
    results.push({
        name: '更新统计数据',
        success: runScript('update-stats.js', '更新统计数据')
    });
    
    // 3. 更新日报和学习记录
    results.push({
        name: '更新日报和学习记录',
        success: runScript('update-daily-blog.js', '更新日报和学习记录')
    });
    
    // 4. 更新主页数据
    results.push({
        name: '更新主页数据',
        success: runScript('update-main-page.js', '更新主页数据')
    });
    
    // 汇总结果
    log('\n========================================');
    log('更新结果汇总');
    log('========================================');
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;
    
    results.forEach(r => {
        log(`${r.success ? '✅' : '❌'} ${r.name}`);
    });
    
    log(`\n总计: ${successCount} 成功, ${failCount} 失败`);
    log('========================================');
    log('博客日常更新完成');
    log('========================================\n');
    
    // 返回退出码
    process.exit(failCount > 0 ? 1 : 0);
}

// 执行
main();
