# Start the backend server
Write-Host "Starting HomeSwift Backend Server..." -ForegroundColor Green
Write-Host "Server will run on http://127.0.0.1:5001" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Start the server
python app.py

