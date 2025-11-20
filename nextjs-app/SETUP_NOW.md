# 🚀 Setup Instructions - Do This Now

## Important: Close and Reopen PowerShell

After installing Node.js, you **must** close and reopen PowerShell for it to recognize Node.js.

## Step-by-Step Setup

### 1. Close This PowerShell Window
   - Close the current PowerShell/terminal window completely

### 2. Open a NEW PowerShell Window
   - Press `Win + X` and select "Windows PowerShell" or "Terminal"
   - Or search for "PowerShell" in Start menu

### 3. Navigate to the Project
   ```powershell
   cd C:\Users\fuzil\OneDrive\Desktop\House-Hero-development-main\nextjs-app
   ```

### 4. Verify Node.js is Working
   ```powershell
   node --version
   npm --version
   ```
   
   You should see version numbers. If not, Node.js might not be in your PATH.

### 5. Install Dependencies
   ```powershell
   npm install
   ```
   
   This will take 2-3 minutes. Wait for it to complete.

### 6. Set Up Database
   ```powershell
   npm run db:generate
   npm run db:push
   ```

### 7. Start the Development Server
   ```powershell
   npm run dev
   ```

### 8. Open Your Browser
   - Go to: **http://localhost:3000**
   - You should see the home page!

## Quick Copy-Paste Commands

Copy and paste these commands one by one in a **NEW** PowerShell window:

```powershell
cd C:\Users\fuzil\OneDrive\Desktop\House-Hero-development-main\nextjs-app
node --version
npm --version
npm install
npm run db:generate
npm run db:push
npm run dev
```

## If Node.js Still Not Found

If `node --version` doesn't work in a new PowerShell:

1. **Restart your computer** (this refreshes all environment variables)
2. Or manually add Node.js to PATH:
   - Usually installed at: `C:\Program Files\nodejs\`
   - Add this to your system PATH environment variable

## What You'll See

Once `npm run dev` starts:
- ✅ Server will start on port 3000
- ✅ You'll see: "Ready - started server on 0.0.0.0:3000"
- ✅ Open http://localhost:3000 in your browser

## Need Help?

- Make sure you closed and reopened PowerShell
- Try restarting your computer if Node.js still not found
- Check Node.js installation: https://nodejs.org/

