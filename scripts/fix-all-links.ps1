# Fix all links in HTML files

Write-Host "Starting link fixes..." -ForegroundColor Green

# 1. Fix pages/projects.html
Write-Host "Fixing pages/projects.html..." -ForegroundColor Yellow
$content = Get-Content "pages\projects.html" -Raw -Encoding UTF8
$content = $content -replace 'href="projects/', 'href="../projects/'
Set-Content "pages\projects.html" -Value $content -Encoding UTF8 -NoNewline
Write-Host "Done" -ForegroundColor Green

# 2. Fix pages/papers.html
Write-Host "Fixing pages/papers.html..." -ForegroundColor Yellow
$content = Get-Content "pages\papers.html" -Raw -Encoding UTF8
$content = $content -replace 'href="papers/', 'href="../papers/'
Set-Content "pages\papers.html" -Value $content -Encoding UTF8 -NoNewline
Write-Host "Done" -ForegroundColor Green

# 3. Fix keke/index.html
Write-Host "Fixing keke/index.html..." -ForegroundColor Yellow
$content = Get-Content "keke\index.html" -Raw -Encoding UTF8
$content = $content -replace 'src="images/', 'src="../images/'
$content = $content -replace 'href="keke-diary.html"', 'href="articles/keke-001.html"'
$content = $content -replace 'href="keke-reading.html"', 'href="articles/keke-001.html"'
$content = $content -replace 'href="keke-learning.html"', 'href="articles/keke-001.html"'
$content = $content -replace 'href="keke-thoughts.html"', 'href="articles/keke-001.html"'
Set-Content "keke\index.html" -Value $content -Encoding UTF8 -NoNewline
Write-Host "Done" -ForegroundColor Green

# 4. Fix about/about-lin.html
Write-Host "Fixing about/about-lin.html..." -ForegroundColor Yellow
$content = Get-Content "about\about-lin.html" -Raw -Encoding UTF8
$content = $content -replace 'href="projects/', 'href="../projects/'
$content = $content -replace 'src="images/', 'src="../images/'
Set-Content "about\about-lin.html" -Value $content -Encoding UTF8 -NoNewline
Write-Host "Done" -ForegroundColor Green

# 5. Fix about/about-keke.html
Write-Host "Fixing about/about-keke.html..." -ForegroundColor Yellow
$content = Get-Content "about\about-keke.html" -Raw -Encoding UTF8
$content = $content -replace 'href="skill-detail.html', 'href="../skill-detail.html'
$content = $content -replace 'href="skills.html"', 'href="../pages/skills.html"'
$content = $content -replace 'src="images/', 'src="../images/'
Set-Content "about\about-keke.html" -Value $content -Encoding UTF8 -NoNewline
Write-Host "Done" -ForegroundColor Green

# 6. Fix papers/*.html
Write-Host "Fixing papers/*.html..." -ForegroundColor Yellow
$paperFiles = Get-ChildItem "papers\*.html" -File
$count = 0
foreach ($file in $paperFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $content = $content -replace 'href="pages/', 'href="../pages/'
    $content = $content -replace 'href="keke/index.html"', 'href="../keke/index.html"'
    Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline
    $count++
}
Write-Host "Fixed $count files" -ForegroundColor Green

# 7. Fix projects/*.html
Write-Host "Fixing projects/*.html..." -ForegroundColor Yellow
$projectFiles = Get-ChildItem "projects\*.html" -File
$count = 0
foreach ($file in $projectFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $content = $content -replace 'href="pages/', 'href="../pages/'
    $content = $content -replace 'href="keke/index.html"', 'href="../keke/index.html"'
    Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline
    $count++
}
Write-Host "Fixed $count files" -ForegroundColor Green

Write-Host "All links fixed!" -ForegroundColor Green
