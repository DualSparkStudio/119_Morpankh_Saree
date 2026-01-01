#!/usr/bin/env node
/**
 * Startup script that automatically runs database migrations before starting the server
 * This ensures database schema is always in sync with the code
 */

const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

console.log('🔄 Auto-migration startup script...');
console.log('📦 Checking Prisma setup...');

// Check if Prisma schema exists
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
if (!existsSync(schemaPath)) {
  console.error('❌ Prisma schema not found at:', schemaPath);
  process.exit(1);
}

// Check if database URL is set
if (!process.env.DATABASE_URL) {
  console.warn('⚠️  WARNING: DATABASE_URL is not set. Database operations will fail.');
} else {
  console.log('✅ DATABASE_URL is set');
}

try {
  // Step 1: Generate Prisma Client
  console.log('📦 Generating Prisma Client...');
  execSync('npx prisma generate', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });
  console.log('✅ Prisma Client generated');

  // Step 2: Try to apply migrations first (preferred method)
  console.log('🔄 Checking for pending migrations...');
  try {
    execSync('npx prisma migrate deploy --skip-generate', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
    console.log('✅ Database migrations applied');
  } catch (migrateError) {
    // If migrate deploy fails (no migrations or error), fallback to db push
    console.log('📝 No migrations found or migration failed, syncing schema directly...');
    try {
      execSync('npx prisma db push --skip-generate --accept-data-loss', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
      });
      console.log('✅ Database schema synced');
    } catch (pushError) {
      console.error('❌ Failed to sync database schema');
      console.error('Migration error:', migrateError.message);
      console.error('Push error:', pushError.message);
      // Don't exit - let the server start anyway (might be a connection issue that resolves)
      console.warn('⚠️  Continuing anyway - server may fail to start if DB is required');
    }
  }

  // Step 3: Start the server
  console.log('🚀 Starting server...');
  const { spawn } = require('child_process');
  const server = spawn('node', ['dist/index.js'], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    env: process.env,
  });

  server.on('error', (error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });

  server.on('exit', (code) => {
    process.exit(code || 0);
  });
} catch (error) {
  console.error('❌ Startup script error:', error);
  process.exit(1);
}

