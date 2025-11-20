# 🚀 How to Start the Server (Step-by-Step)

## Important: You MUST be in the `nextjs-app` folder!

## Step-by-Step Instructions:

### 1. Open a NEW PowerShell Window
   - Press `Win + X` → Select "Windows PowerShell" or "Terminal"
   - **OR** Press `Win + R` → Type `powershell` → Press Enter

### 2. Navigate to the Correct Folder
   Copy and paste this EXACT command:
   ```powershell
   cd C:\Users\fuzil\OneDrive\Desktop\House-Hero-development-main\nextjs-app
   ```

### 3. Verify You're in the Right Place
   You should see:
   ```
   PS C:\Users\fuzil\OneDrive\Desktop\House-Hero-development-main\nextjs-app>
   ```
   
   Notice: It ends with `nextjs-app>` NOT just `House-Hero-development-main>`

### 4. Verify Node.js Works
   ```powershell
   node --version
   npm --version
   ```
   
   If these don't work, **restart your computer** (Node.js needs to be in PATH)

### 5. Start the Server
   ```powershell
   npm run dev
   ```

### 6. Wait for "Ready" Message
   You should see:
   ```
   ▲ Next.js 14.2.5
   - Local:        http://localhost:3000
   ✓ Ready in X seconds
   ```

### 7. Open Browser
   Go to: **http://localhost:3000**

## ⚠️ Common Mistakes:

❌ **Wrong:** `C:\Users\fuzil\...\House-Hero-development-main>` (root folder)
✅ **Correct:** `C:\Users\fuzil\...\House-Hero-development-main\nextjs-app>` (nextjs-app folder)

❌ **Wrong:** Opening `file:///C:/Users/...` (file path)
✅ **Correct:** Opening `http://localhost:3000` (web URL)

## If npm Still Not Found:

1. **Restart your computer** (refreshes PATH)
2. Or manually add Node.js to PATH:
   - Node.js is usually at: `C:\Program Files\nodejs\`
   - Add this to System Environment Variables → PATH

## Quick Copy-Paste (All at Once):

```powershell
cd C:\Users\fuzil\OneDrive\Desktop\House-Hero-development-main\nextjs-app
node --version
npm --version
npm run dev
```

