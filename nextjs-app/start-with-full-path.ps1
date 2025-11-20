# PowerShell script to start Next.js server using full path to npm
# Use this if npm is not in your PATH

Write-Host "Starting Next.js server..." -ForegroundColor Green
Write-Host ""

# Common Node.js installation paths
$npmPaths = @(
    "C:\Program Files\nodejs\npm.cmd",
    "C:\Program Files (x86)\nodejs\npm.cmd",
    "$env:APPDATA\npm\npm.cmd"
)

$npmPath = $null
foreach ($path in $npmPaths) {
    if (Test-Path $path) {
        $npmPath = $path
        Write-Host "✅ Found npm at: $path" -ForegroundColor Green
        break
    }
}

if (-not $npmPath) {
    Write-Host "❌ Could not find npm!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "1. Install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "2. Make sure 'Add to PATH' is checked during installation" -ForegroundColor Yellow
    Write-Host "3. Restart your computer" -ForegroundColor Yellow
    exit 1
}

# Change to nextjs-app directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Yellow
Write-Host ""

# Start the server
& $npmPath run dev

