# Vercel Database Setup - Quick Fix

## The Problem
You're getting "Database connection failed" because Vercel requires PostgreSQL, not SQLite.

## Quick Fix (5 Steps)

### Step 1: Create PostgreSQL Database on Vercel

1. Go to your Vercel project dashboard
2. Click on the **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose a name (e.g., "homeswift-db") and region
6. Click **Create**

### Step 2: Get Connection String

1. After the database is created, click on it
2. Go to the **.env.local** tab
3. Copy the `POSTGRES_URL` value (it looks like: `postgres://default:xxx@xxx.vercel-storage.com:5432/verceldb`)

### Step 3: Add Environment Variable in Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Paste the `POSTGRES_URL` you copied (or use the format: `postgres://user:password@host:port/database?sslmode=require`)
   - **Environment**: Select **Production**, **Preview**, and **Development**
3. Click **Save**

### Step 4: Update Database Schema Locally

The schema is already set to PostgreSQL. Now you need to push it to your Vercel database:

```bash
cd nextjs-app

# Set your DATABASE_URL temporarily (or use the one from Vercel)
export DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Generate Prisma client
npx prisma generate

# Push schema to create tables
npx prisma db push

# Optional: Seed initial data
npm run db:seed
```

**OR** use Vercel's CLI:

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Pull environment variables
vercel env pull .env.local

# Now run prisma commands
npx prisma generate
npx prisma db push
```

### Step 5: Redeploy

1. Go to your Vercel project dashboard
2. Click **Deployments**
3. Click the **⋯** (three dots) on the latest deployment
4. Click **Redeploy**

Or push a new commit to trigger a new deployment.

## Alternative: Use Supabase (Free)

If you prefer not to use Vercel Postgres:

1. Go to [supabase.com](https://supabase.com)
2. Create a free account and project
3. Go to **Settings** → **Database**
4. Copy the connection string (URI format)
5. Add it as `DATABASE_URL` in Vercel environment variables
6. Run `npx prisma db push` locally with that connection string

## Verify It Works

After deployment:
1. Try logging in again
2. Check Vercel logs: **Deployments** → Click deployment → **Functions** tab
3. Look for any database errors

## Important Notes

- **Never commit `.env` files** with real credentials
- The `DATABASE_URL` in Vercel should be set for all environments (Production, Preview, Development)
- After setting up the database, you'll need to create an admin user (use `/setup-admin.html` or the API endpoint)

