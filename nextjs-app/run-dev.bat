@echo off
echo Starting Next.js Development Server...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file...
    copy ".env.example" ".env" 2>nul
    echo .env file created. Please edit it with your settings.
    echo.
)

REM Generate Prisma client
echo Generating Prisma client...
call npm run db:generate
echo.

REM Push database schema
echo Setting up database...
call npm run db:push
echo.

REM Start dev server
echo Starting development server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
call npm run dev

