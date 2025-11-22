# Troubleshooting Admin Login

## If admin login is not working, try these steps:

### 1. Verify Admin User Exists
Run this command to check:
```bash
npx tsx -e "import { PrismaClient } from '@prisma/client'; const p = new PrismaClient(); p.user.findUnique({ where: { email: 'admin@homeswift.com' } }).then(u => { console.log('User:', u); p.$disconnect(); })"
```

### 2. Check Browser Console
After logging in, open browser DevTools (F12) and check:
- Console tab for any errors
- Application/Storage tab → Local Storage → Check if `user` key exists and contains `role: "admin"`

### 3. Clear Browser Cache
- Clear localStorage: `localStorage.clear()` in browser console
- Try logging in again

### 4. Restart Dev Server
Stop the Next.js dev server (Ctrl+C) and restart:
```bash
npm run dev
```

### 5. Verify Login Response
In browser console after login, check:
```javascript
JSON.parse(localStorage.getItem('user'))
```
Should show: `{ ..., role: "admin", ... }`

### 6. Manual Admin Creation
If needed, manually set admin role:
```bash
npm run db:set-admin admin@homeswift.com admin123
```

### 7. Check Network Tab
In DevTools → Network tab:
- Look for `/api/auth/login` request
- Check the response - it should include `user.role: "admin"`

## Expected Behavior:
1. Login with `admin@homeswift.com` / `admin123`
2. Browser console shows: "Is admin? true"
3. Redirects to `/admin`
4. Admin dashboard loads

## If Still Not Working:
Check the admin page console for any errors about authentication checks.

