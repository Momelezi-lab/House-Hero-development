@echo off
echo ========================================
echo Starting House Hero Next.js App
echo ========================================
echo.

cd /d "%~dp0"

echo Testing npm...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: npm not found!
    echo.
    echo Please:
    echo 1. Close this window
    echo 2. Restart your computer
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
)

echo npm found!
echo.
echo Starting development server...
echo.
echo Your app will be available at:
echo    http://localhost:3000
echo.
echo Please wait 20-30 seconds for server to start...
echo Press Ctrl+C to stop the server
echo.

call npm run dev

