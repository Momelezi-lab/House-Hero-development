# PowerShell script to start the Next.js development server
Write-Host "Starting Next.js Development Server..." -ForegroundColor Green
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env" -ErrorAction SilentlyContinue
    Write-Host ".env file created. Please edit it with your settings." -ForegroundColor Yellow
    Write-Host ""
}

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npm run db:generate
Write-Host ""

# Push database schema
Write-Host "Setting up database..." -ForegroundColor Yellow
npm run db:push
Write-Host ""

# Start dev server
Write-Host "Starting development server on http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
npm run dev

