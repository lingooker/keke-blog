// 扫描技能目录，生成 skills.json
const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, '..', 'skills');
const outputFile = path.join(__dirname, 'data', 'skills.json');

function parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);

    if (!match) return {};

    const frontmatter = {};
    match[1].split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            frontmatter[key] = value;
        }
    });

    return frontmatter;
}

function extractDescription(content) {
    // 移除 frontmatter
    let text = content.replace(/^---\n[\s\S]*?\n---/, '');
    // 提取第一段非空文本
    const lines = text.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('>')) {
            return trimmed.substring(0, 150) + (trimmed.length > 150 ? '...' : '');
        }
    }
    return '';
}

function scanSkills() {
    const skills = [];

    if (!fs.existsSync(skillsDir)) {
        console.error('Skills directory not found:', skillsDir);
        return skills;
    }

    const entries = fs.readdirSync(skillsDir, { withFileTypes: true });

    entries.forEach(entry => {
        if (!entry.isDirectory()) return;

        const skillPath = path.join(skillsDir, entry.name);
        const skillFile = path.join(skillPath, 'SKILL.md');

        if (!fs.existsSync(skillFile)) return;

        try {
            const content = fs.readFileSync(skillFile, 'utf-8');
            const frontmatter = parseFrontmatter(content);
            const description = extractDescription(content);

            skills.push({
                name: frontmatter.name || entry.name,
                description: frontmatter.description || description || '暂无描述',
                folder: entry.name,
                path: `skills/${entry.name}/SKILL.md`
            });
        } catch (error) {
            console.error(`Error reading ${skillFile}:`, error.message);
        }
    });

    return skills;
}

// 主函数
function main() {
    console.log('扫描技能目录...');
    const skills = scanSkills();
    console.log(`发现 ${skills.length} 个技能`);

    // 确保输出目录存在
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 写入 JSON
    fs.writeFileSync(outputFile, JSON.stringify(skills, null, 2), 'utf-8');
    console.log('已生成:', outputFile);
}

main();
