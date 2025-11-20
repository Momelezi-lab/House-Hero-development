# Install Node.js First

## ⚠️ Node.js is Required

You need to install **Node.js** before you can run the Next.js app.

## Quick Install (5 minutes)

### Step 1: Download Node.js

1. Go to: **https://nodejs.org/**
2. Click the big green button that says **"Download Node.js (LTS)"**
   - LTS = Long Term Support (recommended)
   - This includes both Node.js and npm

### Step 2: Install Node.js

1. Run the downloaded installer (`.msi` file)
2. Click "Next" through the installation wizard
3. **Important:** Make sure "Add to PATH" is checked (it should be by default)
4. Click "Install"
5. Wait for installation to complete
6. Click "Finish"

### Step 3: Verify Installation

1. **Close and reopen PowerShell** (important!)
2. Run these commands:

```powershell
node --version
npm --version
```

You should see version numbers like:
```
v20.10.0
10.2.3
```

If you see version numbers, you're ready! ✅

## After Installing Node.js

Once Node.js is installed, come back and I'll help you set up the app!

Or follow these steps:

1. **Open PowerShell in the `nextjs-app` folder:**
   ```powershell
   cd C:\Users\fuzil\OneDrive\Desktop\House-Hero-development-main\nextjs-app
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Create .env file** (see SETUP_ENVIRONMENT.md)

4. **Set up database:**
   ```powershell
   npm run db:generate
   npm run db:push
   ```

5. **Start the app:**
   ```powershell
   npm run dev
   ```

6. **Open browser:** http://localhost:3000

## Alternative: Use nvm (Node Version Manager)

If you prefer managing multiple Node.js versions:

1. Install nvm-windows: https://github.com/coreybutler/nvm-windows
2. Then: `nvm install lts`
3. Then: `nvm use lts`

## Need Help?

- Node.js website: https://nodejs.org/
- Node.js documentation: https://nodejs.org/docs/
- If installation fails, try running PowerShell as Administrator

