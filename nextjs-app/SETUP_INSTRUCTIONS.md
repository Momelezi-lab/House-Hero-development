# Setup Instructions for Next.js App

## Quick Start

1. **Navigate to the new app directory:**
   ```bash
   cd nextjs-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add:
   # - DATABASE_URL (PostgreSQL connection string)
   # - Email credentials (MAIL_USERNAME, MAIL_PASSWORD, etc.)
   # - ADMIN_EMAIL
   ```

4. **Set up the database:**
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Push schema to database (creates all tables)
   npm run db:push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at http://localhost:3000

## Database Options

### Option 1: Vercel Postgres (Recommended for Deployment)
1. Create a Vercel account
2. Create a Postgres database
3. Copy the connection string to `DATABASE_URL`

### Option 2: Supabase (Free Tier Available)
1. Create a Supabase account
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

### Option 3: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database: `createdb house_hero`
3. Set `DATABASE_URL="postgresql://user:password@localhost:5432/house_hero"`

## What's Been Converted

### ✅ Completed

1. **Project Structure**
   - Next.js 14 with App Router
   - TypeScript configuration
   - Tailwind CSS setup

2. **Database**
   - Prisma schema (all models converted)
   - Database client setup

3. **API Routes** (All Flask routes converted)
   - `/api/health` - Health check
   - `/api/pricing` - Get pricing data
   - `/api/service-requests` - Create/get service requests
   - `/api/service-requests/[id]` - Get/update single request
   - `/api/providers` - Provider CRUD
   - `/api/auth/signup` - User signup
   - `/api/auth/login` - User login
   - `/api/bookings` - Booking CRUD
   - `/api/complaints` - Complaint CRUD

4. **Core Utilities**
   - Prisma client
   - Email sending (Nodemailer)
   - API client
   - Type definitions

5. **Frontend Setup**
   - Root layout
   - Providers (TanStack Query)
   - Home page
   - Global styles

### ⏳ Still To Do

1. **Frontend Pages** (Need to be converted from HTML to React)
   - Booking form (`/book-service`)
   - Admin dashboard (`/admin`)
   - Login/Signup pages
   - Profile page
   - Settings page
   - Other service pages

2. **Components**
   - Service selection cards
   - Booking summary
   - Admin dashboard components
   - Form components

3. **State Management**
   - Zustand stores
   - TanStack Query hooks

4. **Additional Features**
   - Authentication (NextAuth.js - optional)
   - Image uploads
   - File handling

## Testing the API

Once the database is set up, you can test the API:

```bash
# Health check
curl http://localhost:3000/api/health

# Get pricing categories
curl http://localhost:3000/api/pricing

# Get pricing for a category
curl http://localhost:3000/api/pricing?category=Couch%20Deep%20Cleaning
```

## Seeding Pricing Data

The pricing data needs to be seeded. You can:

1. **Use the API endpoint** (after creating it):
   ```bash
   curl -X POST http://localhost:3000/api/admin/seed-pricing
   ```

2. **Or manually insert** using Prisma Studio:
   ```bash
   npm run db:studio
   ```

## Next Steps

1. **Complete frontend conversion:**
   - Convert `book-service.html` to React component
   - Convert `admin-dashboard.html` to React component
   - Convert other pages

2. **Add TanStack Query hooks:**
   - Create hooks for API calls
   - Set up query caching

3. **Add Zustand stores:**
   - User authentication state
   - Cart/booking state
   - UI state

4. **Test everything:**
   - Test booking flow
   - Test admin dashboard
   - Test email sending

## Troubleshooting

### Database Connection Issues
- Check `DATABASE_URL` format
- Ensure PostgreSQL is running (if local)
- Check firewall/network settings (if cloud)

### Email Not Sending
- Verify email credentials in `.env`
- For Gmail, use an App Password (not regular password)
- Check SMTP settings

### Build Errors
- Run `npm run db:generate` after schema changes
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Netlify: Supports Next.js
- Railway: Good for full-stack apps
- Render: Similar to Heroku

## Support

If you encounter issues:
1. Check the console for errors
2. Review the API routes in `src/app/api/`
3. Check Prisma schema in `prisma/schema.prisma`
4. Review the migration guide in `MIGRATION_GUIDE.md`

