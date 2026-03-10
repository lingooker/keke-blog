# 修复博客导航链接脚本

$blogDir = "C:\Users\Administrator\.openclaw\workspace\blog-html"

# 1. 修复 pages/ 目录下的页面
$pagesDir = Join-Path $blogDir "pages"
Get-ChildItem $pagesDir -Filter "*.html" | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw -Encoding UTF8

    # 更新导航链接
    $content = $content -replace 'href="index\.html"', 'href="../index.html"'
    $content = $content -replace 'href="projects\.html"', 'href="projects.html"'
    $content = $content -replace 'href="papers\.html"', 'href="papers.html"'
    $content = $content -replace 'href="daily\.html"', 'href="daily.html"'
    $content = $content -replace 'href="skills\.html"', 'href="skills.html"'
    $content = $content -replace 'href="learnings\.html"', 'href="learnings.html"'
    $content = $content -replace 'href="keke\.html"', 'href="../keke/index.html"'
    $content = $content -replace 'href="keke/index\.html"', 'href="../keke/index.html"'
    $content = $content -replace 'href="about-keke\.html"', 'href="../about/about-keke.html"'
    $content = $content -replace 'href="about-lin\.html"', 'href="../about/about-lin.html"'

    # 更新数据文件路径
    $content = $content -replace 'src="data/', 'src="../data/'
    $content = $content -replace 'fetch\(''data/', 'fetch(''../data/'

    # 保存文件
    [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
    Write-Host "已修复: $($_.Name)"
}

# 2. 修复 about/ 目录下的页面
$aboutDir = Join-Path $blogDir "about"
Get-ChildItem $aboutDir -Filter "*.html" | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw -Encoding UTF8

    # 更新导航链接
    $content = $content -replace 'href="index\.html"', 'href="../index.html"'
    $content = $content -replace 'href="projects\.html"', 'href="../pages/projects.html"'
    $content = $content -replace 'href="papers\.html"', 'href="../pages/papers.html"'
    $content = $content -replace 'href="daily\.html"', 'href="../pages/daily.html"'
    $content = $content -replace 'href="skills\.html"', 'href="../pages/skills.html"'
    $content = $content -replace 'href="keke\.html"', 'href="../keke/index.html"'
    $content = $content -replace 'href="about-keke\.html"', 'href="about-keke.html"'
    $content = $content -replace 'href="about-lin\.html"', 'href="about-lin.html"'

    # 保存文件
    [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
    Write-Host "已修复: $($_.Name)"
}

# 3. 修复 keke/ 目录下的页面
$kekeIndex = Join-Path $blogDir "keke\index.html"
if (Test-Path $kekeIndex) {
    $content = Get-Content $kekeIndex -Raw -Encoding UTF8

    # 更新导航链接（已经修复过）
    # 确保数据路径正确
    $content = $content -replace 'src="data/', 'src="../data/'
    $content = $content -replace 'fetch\(''data/', 'fetch(''../data/'

    [System.IO.File]::WriteAllText($kekeIndex, $content, [System.Text.Encoding]::UTF8)
    Write-Host "已修复: keke/index.html"
}

# 4. 修复 keke/articles/ 目录下的页面
$articlesDir = Join-Path $blogDir "keke\articles"
Get-ChildItem $articlesDir -Filter "*.html" | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw -Encoding UTF8

    # 更新导航链接
    $content = $content -replace 'href="\.\./index\.html"', 'href="../../index.html"'
    $content = $content -replace 'href="\.\./keke\.html"', 'href="../index.html"'

    # 保存文件
    [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
    Write-Host "已修复: $($_.Name)"
}

Write-Host "`n✅ 所有页面链接已修复！"
