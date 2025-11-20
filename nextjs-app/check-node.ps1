# Check if Node.js and npm are installed
Write-Host "Checking Node.js installation..." -ForegroundColor Cyan
Write-Host ""

try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Download the LTS version and run the installer." -ForegroundColor Yellow
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is NOT installed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Node.js and npm are ready! ✅" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm install" -ForegroundColor Yellow
Write-Host "2. Run: npm run db:generate" -ForegroundColor Yellow
Write-Host "3. Run: npm run db:push" -ForegroundColor Yellow
Write-Host "4. Run: npm run dev" -ForegroundColor Yellow
Write-Host ""

