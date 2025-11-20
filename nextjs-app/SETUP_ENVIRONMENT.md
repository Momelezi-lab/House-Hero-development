# Environment Setup Guide

## Prerequisites Check

You need **Node.js** installed to run the Next.js app.

### Check if Node.js is installed:

Open PowerShell and run:
```powershell
node --version
npm --version
```

If you see version numbers, Node.js is installed! ✅

If you get an error, you need to install Node.js first.

## Install Node.js (if needed)

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Download the **LTS version** (recommended)
   - Run the installer

2. **Verify installation:**
   - Close and reopen PowerShell
   - Run: `node --version`
   - Should show: `v18.x.x` or higher

## Setup Steps (After Node.js is installed)

### Step 1: Open PowerShell in the `nextjs-app` folder

```powershell
cd C:\Users\fuzil\OneDrive\Desktop\House-Hero-development-main\nextjs-app
```

### Step 2: Install Dependencies

```powershell
npm install
```

This will take 2-3 minutes. Wait for it to complete.

### Step 3: Create .env File

Create a file named `.env` in the `nextjs-app` folder with this content:

```env
DATABASE_URL="file:./dev.db"
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=test@example.com
MAIL_PASSWORD=test
MAIL_DEFAULT_SENDER=noreply@homeswift.com
ADMIN_EMAIL=admin@homeswift.com
ADMIN_PHONE=+27 11 123 4567
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 4: Set Up Database

```powershell
npm run db:generate
npm run db:push
```

### Step 5: Start Development Server

```powershell
npm run dev
```

### Step 6: Open Browser

Go to: **http://localhost:3000**

## Quick Setup Script

If you prefer, you can use the provided script:

**PowerShell:**
```powershell
.\run-dev.ps1
```

**Command Prompt:**
```cmd
run-dev.bat
```

## Troubleshooting

### "npm is not recognized"
- Install Node.js from https://nodejs.org/
- Restart PowerShell after installation
- Verify with: `npm --version`

### "Port 3000 already in use"
- Close other apps using port 3000
- Or use: `npm run dev -- -p 3001`

### "Module not found"
- Delete `node_modules` folder
- Run: `npm install` again

### "Database error"
- Make sure you ran: `npm run db:generate` and `npm run db:push`
- Check `.env` file exists and has `DATABASE_URL="file:./dev.db"`

## What You'll See

Once running:
- ✅ Home page at http://localhost:3000
- ✅ Booking form at http://localhost:3000/book-service
- ✅ Hot reload (changes appear automatically)

## Need Help?

1. Make sure Node.js is installed: `node --version`
2. Make sure you're in the `nextjs-app` folder
3. Run `npm install` first
4. Then follow steps 3-6 above

