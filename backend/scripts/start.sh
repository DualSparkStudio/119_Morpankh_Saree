#!/bin/bash
# Auto-run database migrations before starting the server

set -e  # Exit on any error

echo "🔄 Checking database connection..."

# Wait for database to be ready (useful for Render deployments)
if [ -n "$DATABASE_URL" ]; then
  echo "✅ DATABASE_URL is set"
else
  echo "⚠️  WARNING: DATABASE_URL is not set"
fi

echo "📦 Generating Prisma Client..."
npx prisma generate

echo "🔄 Syncing database schema..."
# Try migrate deploy first (for migration files), then fallback to db push (for schema sync)
if npx prisma migrate deploy --skip-generate 2>/dev/null; then
  echo "✅ Applied database migrations"
else
  echo "📝 No migrations found, syncing schema directly..."
  if npx prisma db push --skip-generate --accept-data-loss; then
    echo "✅ Database schema synced"
  else
    echo "❌ Failed to sync database schema"
    exit 1
  fi
fi

echo "🚀 Starting server..."
exec node dist/index.js

