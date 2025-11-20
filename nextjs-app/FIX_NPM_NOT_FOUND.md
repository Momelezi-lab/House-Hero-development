# Fix: "npm is not recognized" Error

## The Problem
Node.js is installed but PowerShell can't find it because it's not in your PATH.

## Solution 1: Restart Your Computer (Easiest)
1. **Save all your work**
2. **Restart your computer**
3. Open PowerShell again
4. Try `npm --version` - it should work now!

## Solution 2: Find Node.js and Add to PATH Manually

### Step 1: Find Where Node.js is Installed
Open File Explorer and check these locations:
- `C:\Program Files\nodejs\`
- `C:\Program Files (x86)\nodejs\`
- `C:\Users\fuzil\AppData\Roaming\npm\`

### Step 2: Add to PATH
1. Press `Win + R`
2. Type: `sysdm.cpl` and press Enter
3. Click "Advanced" tab
4. Click "Environment Variables"
5. Under "System variables", find "Path" and click "Edit"
6. Click "New"
7. Add: `C:\Program Files\nodejs\` (or wherever you found Node.js)
8. Click "OK" on all windows
9. **Close and reopen PowerShell**

### Step 3: Test
```powershell
node --version
npm --version
```

## Solution 3: Use Full Path to npm (Quick Test)
If Node.js is at `C:\Program Files\nodejs\`, try:
```powershell
& "C:\Program Files\nodejs\npm.cmd" --version
```

If that works, you can start the server with:
```powershell
& "C:\Program Files\nodejs\npm.cmd" run dev
```

## Solution 4: Reinstall Node.js (If Nothing Works)
1. Go to: https://nodejs.org/
2. Download the LTS version
3. **During installation, make sure "Add to PATH" is checked**
4. Complete installation
5. **Restart your computer**
6. Open new PowerShell and try again

## Quick Test Commands
Run these to find Node.js:
```powershell
# Check common locations
Test-Path "C:\Program Files\nodejs\npm.cmd"
Test-Path "C:\Program Files (x86)\nodejs\npm.cmd"
Get-Command node -ErrorAction SilentlyContinue
```

## After Fixing PATH
Once `npm --version` works:
```powershell
cd C:\Users\fuzil\OneDrive\Desktop\House-Hero-development-main\nextjs-app
npm run dev
```

