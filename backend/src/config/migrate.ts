import { execSync } from 'child_process';
import path from 'path';

export async function runMigrations() {
  try {
    console.log('🔄 Checking database migrations...');
    
    // Get the backend directory path
    const backendDir = path.resolve(__dirname, '../..');
    
    // Try to run migrations
    try {
      execSync('npx prisma migrate deploy', { 
        stdio: 'inherit',
        cwd: backendDir,
        env: { ...process.env }
      });
      console.log('✅ Migrations applied successfully');
    } catch (error: any) {
      // If migrate deploy fails (no migrations), try db push
      console.log('⚠️  No migrations found, pushing schema...');
      try {
        execSync('npx prisma db push --skip-generate', { 
          stdio: 'inherit',
          cwd: backendDir,
          env: { ...process.env }
        });
        console.log('✅ Database schema synced successfully');
      } catch (pushError) {
        console.error('❌ Failed to sync database schema:', pushError);
        // Don't throw - let the server start anyway
        console.log('⚠️  Continuing server startup despite migration errors...');
      }
    }
  } catch (error) {
    console.error('❌ Migration check failed:', error);
    // Don't throw - let the server start anyway
    console.log('⚠️  Continuing server startup despite migration errors...');
  }
}

