# 🚀 How to Live Preview Your Next.js App

## Quick Steps (5 minutes)

### 1. Open Terminal in the `nextjs-app` folder

```bash
cd nextjs-app
```

### 2. Install Dependencies

```bash
npm install
```

This will take 1-2 minutes the first time.

### 3. Create Environment File

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

**Note:** For quick preview, you can use dummy email values. The app will run, emails just won't send.

### 4. Switch to SQLite (Easier for Preview)

Edit `prisma/schema.prisma` and change line 9 from:
```prisma
provider = "postgresql"
```
to:
```prisma
provider = "sqlite"
```

### 5. Set Up Database

```bash
npm run db:generate
npm run db:push
```

### 6. Start the Development Server

```bash
npm run dev
```

### 7. Open in Browser

Go to: **http://localhost:3000**

You should see the home page! 🎉

## Test the Booking Flow

1. Click "Book Cleaning Service" or go to: **http://localhost:3000/book-service**
2. Select a category (e.g., "Couch Deep Cleaning")
3. Click "Add to Cart" on a service
4. Fill in the form
5. Submit!

## What You'll See

- ✅ Home page with service cards
- ✅ Booking form with category/service selection
- ✅ Real-time price calculations
- ✅ Cart management
- ✅ Form submission

## Troubleshooting

**"Module not found" error?**
```bash
rm -rf node_modules
npm install
```

**"Database error"?**
- Make sure you ran `npm run db:generate` and `npm run db:push`
- Check that `DATABASE_URL` in `.env` is correct

**Port 3000 already in use?**
- Close other apps using port 3000
- Or change port: `npm run dev -- -p 3001`

**API not working?**
- Check: http://localhost:3000/api/health
- Should return: `{"status":"healthy","message":"House Hero Backend is running!"}`

## Need Help?

Check the full setup guide: `SETUP_INSTRUCTIONS.md`

