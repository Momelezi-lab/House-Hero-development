# Quick Start - Live Preview

## Step 1: Install Dependencies

```bash
cd nextjs-app
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the `nextjs-app` directory:

```bash
# Copy the example
cp .env.example .env
```

**Minimum required for preview:**
```env
# Database (you can use SQLite for quick testing)
DATABASE_URL="file:./dev.db"

# Or use PostgreSQL (if you have it set up)
# DATABASE_URL="postgresql://user:password@localhost:5432/house_hero"

# Email (optional for preview - can be dummy values)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=noreply@homeswift.com
ADMIN_EMAIL=admin@homeswift.com
ADMIN_PHONE=+27 11 123 4567

# API URL (for frontend)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**For quick testing without email:**
You can use dummy values for email - the app will still run, emails just won't send.

## Step 3: Set Up Database

### Option A: SQLite (Easiest for Preview)

Update `prisma/schema.prisma` to use SQLite:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

Then:
```bash
npm run db:generate
npm run db:push
```

### Option B: PostgreSQL (Production-like)

If you have PostgreSQL:
```bash
npm run db:generate
npm run db:push
```

## Step 4: Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

## Step 5: Test the Booking Flow

1. Go to: http://localhost:3000
2. Click "Book Cleaning Service" or go to: http://localhost:3000/book-service
3. Select a category → Select a service → Add to cart
4. Fill in the form and submit

## Troubleshooting

### "Module not found" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database errors
- Make sure you ran `npm run db:generate` and `npm run db:push`
- Check your `DATABASE_URL` in `.env`

### Port already in use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in package.json:
# "dev": "next dev -p 3001"
```

### API errors
- Make sure the database is set up
- Check browser console for errors
- Verify API routes are working: http://localhost:3000/api/health

## Quick Test Without Database

If you just want to see the UI without setting up the database:

1. The frontend will still render
2. API calls will fail, but you can see the UI
3. To fully test, you need the database set up

## Next Steps After Preview

1. Set up a real database (PostgreSQL recommended)
2. Configure email settings
3. Seed pricing data (if needed)
4. Test the full booking flow

