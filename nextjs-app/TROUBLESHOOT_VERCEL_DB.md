# Troubleshooting Vercel Database Connection

## Quick Diagnostic

Visit this URL on your Vercel deployment:
```
https://your-app.vercel.app/api/health
```

This will tell you exactly what's wrong:
- ✅ `"database": "connected"` - Database is working!
- ❌ `"database": "not_configured"` - DATABASE_URL is missing
- ❌ `"database": "connection_failed"` - Can't reach database
- ❌ `"database": "tables_missing"` - Tables don't exist (need to run `prisma db push`)

## Common Issues & Fixes

### Issue 1: DATABASE_URL Not Set

**Symptoms:**
- Error: "DATABASE_URL environment variable is not set"
- Health check shows: `"database": "not_configured"`

**Fix:**
1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add `DATABASE_URL` with your PostgreSQL connection string
3. Make sure it's set for **Production**, **Preview**, and **Development**
4. **Redeploy** after adding the variable

### Issue 2: Tables Don't Exist

**Symptoms:**
- Error: "relation does not exist" or "table does not exist"
- Health check shows: `"database": "tables_missing"`

**Fix:**
```bash
cd nextjs-app

# Get your DATABASE_URL from Vercel
# Option 1: Use Vercel CLI
vercel env pull .env.local

# Option 2: Manually set it
export DATABASE_URL="postgresql://your-connection-string"

# Create the tables
npx prisma generate
npx prisma db push

# Optional: Seed data
npm run db:seed
```

### Issue 3: Connection String Format Wrong

**Symptoms:**
- Error: "Can't reach database" or connection timeout
- Health check shows: `"database": "connection_failed"`

**Fix:**
Make sure your `DATABASE_URL` format is correct:

**Vercel Postgres:**
```
postgres://default:password@host.vercel-storage.com:5432/verceldb
```

**Supabase:**
```
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require
```

**Neon:**
```
postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Important:** 
- Must start with `postgresql://` or `postgres://`
- For secure connections, add `?sslmode=require` at the end
- No spaces in the connection string

### Issue 4: Database Not Created

**Symptoms:**
- Can't find database in Vercel Storage

**Fix:**
1. Go to Vercel project → **Storage** tab
2. Click **Create Database**
3. Select **Postgres**
4. Create the database
5. Copy the `POSTGRES_URL` connection string
6. Add it as `DATABASE_URL` in environment variables

## Step-by-Step Verification

### Step 1: Check Environment Variable

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Verify `DATABASE_URL` exists
3. Check it's set for **all environments** (Production, Preview, Development)
4. Click on it to verify the format (should start with `postgresql://`)

### Step 2: Test Connection Locally

```bash
cd nextjs-app

# Pull environment variables from Vercel
vercel env pull .env.local

# Or manually set it
export DATABASE_URL="your-postgres-url-here"

# Test connection
npx prisma db push --skip-generate
```

If this works locally, the connection string is correct.

### Step 3: Create Tables

```bash
# Make sure DATABASE_URL is set (from Step 2)
npx prisma generate
npx prisma db push
```

### Step 4: Verify on Vercel

1. Visit: `https://your-app.vercel.app/api/health`
2. Should see: `"database": "connected"`
3. If not, check the error message

### Step 5: Check Vercel Logs

1. Go to Vercel project → **Deployments**
2. Click on the latest deployment
3. Go to **Functions** tab
4. Click on a function (e.g., `/api/auth/login`)
5. Check the **Logs** for database errors

## Still Not Working?

### Check Vercel Logs

1. **Deployments** → Latest deployment → **Functions** → Click a function → **Logs**
2. Look for:
   - `P1001` - Can't reach database
   - `P1003` - Database/table doesn't exist
   - `P1017` - Server closed connection
   - Connection timeout errors

### Common Prisma Error Codes

- `P1001` - Can't reach database server (check connection string, firewall, network)
- `P1003` - Database doesn't exist (create database first)
- `P1017` - Server closed connection (connection pooling issue, add `?connection_limit=1`)
- `P2002` - Unique constraint violation (data issue, not connection)

### SSL Connection Issues

If using Supabase or other providers, make sure your connection string includes:
```
?sslmode=require
```

Example:
```
postgresql://user:pass@host:5432/db?sslmode=require
```

## Quick Test Script

Create a test file to verify connection:

```bash
# Create test-db.js
cat > test-db.js << 'EOF'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  try {
    await prisma.$connect()
    console.log('✅ Connected!')
    const count = await prisma.user.count()
    console.log(`✅ Users table exists! Count: ${count}`)
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

test()
EOF

# Run it
DATABASE_URL="your-connection-string" node test-db.js
```

## Need More Help?

1. Check `/api/health` endpoint for specific error
2. Check Vercel function logs
3. Verify DATABASE_URL format matches your provider
4. Make sure you ran `npx prisma db push` after setting DATABASE_URL

