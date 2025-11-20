# Start Next.js Server - Run this script
# Double-click this file or run: .\START.ps1

Write-Host "========================================" -ForegroundColor Green
Write-Host "Starting House Hero Next.js App" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Refresh PATH to include Node.js
Write-Host "Refreshing PATH..." -ForegroundColor Cyan
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Navigate to correct directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

# Test npm
Write-Host "Testing npm..." -ForegroundColor Cyan
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "1. Close this window" -ForegroundColor Yellow
    Write-Host "2. Restart your computer" -ForegroundColor Yellow
    Write-Host "3. Run this script again" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host ""
Write-Host "🚀 Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "📍 Your app will be available at:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host ""
Write-Host "⏳ Please wait 20-30 seconds for server to start..." -ForegroundColor Gray
Write-Host "   Look for 'Ready' message below" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start the server
npm run dev

