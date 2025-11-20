# HomeSwift Backend Server Startup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  HomeSwift Backend Server" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting server on http://127.0.0.1:5001" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Change to backend directory
Set-Location $PSScriptRoot

# Start the Flask server
python app.py

