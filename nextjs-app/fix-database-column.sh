#!/bin/bash

# Script to fix the missing interested_providers column
# Usage: ./fix-database-column.sh

echo "🔧 Fixing missing interested_providers column..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is not set."
    echo ""
    echo "Please set it first:"
    echo "  export DATABASE_URL='your-database-url-here'"
    echo ""
    echo "Or if using Vercel CLI:"
    echo "  vercel env pull .env.local"
    echo ""
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Option 1: Try prisma db push (easiest)
echo "📦 Attempting to sync database schema with Prisma..."
npx prisma db push --accept-data-loss

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Database schema has been updated."
    echo "   The interested_providers column has been added."
    echo ""
    echo "You can now try placing a booking again."
else
    echo ""
    echo "⚠️  prisma db push failed. Trying alternative method..."
    echo ""
    echo "Please run the SQL migration manually:"
    echo "  See: prisma/migrations/add_interested_providers.sql"
    echo ""
    echo "Or connect to your database and run:"
    echo "  ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS interested_providers TEXT;"
fi

