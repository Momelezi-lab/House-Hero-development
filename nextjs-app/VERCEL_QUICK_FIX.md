# Quick Fix: Vercel Database Connection Error

## The Problem
You're seeing "Database connection failed" because Vercel needs a PostgreSQL database configured.

## Solution (3 Steps - 5 minutes)

### Step 1: Create PostgreSQL Database on Vercel

1. **Go to your Vercel project dashboard**
2. Click the **Storage** tab (in the top navigation)
3. Click **Create Database** button
4. Select **Postgres**
5. Choose a name (e.g., "homeswift-db")
6. Select a region (choose closest to your users)
7. Click **Create**

### Step 2: Add DATABASE_URL Environment Variable

1. **In the same Vercel project**, go to **Settings** → **Environment Variables**
2. Click **Add New**
3. Enter:
   - **Key**: `DATABASE_URL`
   - **Value**: Copy the `POSTGRES_URL` from your database (it's shown in the Storage tab, or use the format: `postgres://default:xxx@xxx.vercel-storage.com:5432/verceldb`)
   - **Environment**: Check all three boxes:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
4. Click **Save**

### Step 3: Initialize Database Tables

You need to create the tables in your new database. Do this locally:

```bash
cd nextjs-app

# Option A: Use Vercel CLI to get the connection string
npm i -g vercel
vercel env pull .env.local

# Option B: Manually set DATABASE_URL (temporarily)
# export DATABASE_URL="postgresql://your-connection-string-here"

# Generate Prisma client
npx prisma generate

# Create tables in your Vercel database
npx prisma db push

# Optional: Seed pricing data
npm run db:seed
```

### Step 4: Create Admin User

After the database is set up, create an admin user:

```bash
# Using the script
npm run db:set-admin admin@homeswift.com yourpassword

# OR visit in browser (after deployment)
https://your-app.vercel.app/setup-admin.html
```

### Step 5: Redeploy

1. Go to **Deployments** in Vercel
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**

Or just push a commit to trigger a new deployment.

## Verify It Works

1. Try logging in at your Vercel URL
2. Check Vercel logs: **Deployments** → Click deployment → **Functions** tab
3. Look for any errors

## Alternative: Use Supabase (Free)

If you prefer not to use Vercel Postgres:

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the connection string (URI format)
5. Add it as `DATABASE_URL` in Vercel environment variables
6. Run `npx prisma db push` locally with that connection string

## Troubleshooting

**Still getting errors?**
- Make sure `DATABASE_URL` is set for **all environments** (Production, Preview, Development)
- Check Vercel logs for specific error messages
- Verify the connection string format: `postgresql://user:password@host:port/database?sslmode=require`
- Make sure you ran `npx prisma db push` to create the tables

**Need help?**
Check the Vercel deployment logs for specific error messages.

