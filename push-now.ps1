# Push blog updates to GitHub
Write-Host "Pushing blog updates to GitHub..." -ForegroundColor Green
Write-Host "Commits to push:" -ForegroundColor Yellow
git log origin/main..main --oneline
Write-Host ""
Write-Host "Pushing..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Push successful!" -ForegroundColor Green
    Write-Host "GitHub Pages will deploy in 1-2 minutes" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Push failed. Check the error above." -ForegroundColor Red
}
