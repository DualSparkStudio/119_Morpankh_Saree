const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

// Read existing .env if it exists
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Check if DATABASE_URL exists
if (!envContent.includes('DATABASE_URL=')) {
  console.log('⚠️  DATABASE_URL not found in .env file');
  console.log('📝 Adding DATABASE_URL to .env file...');
  
  // Add DATABASE_URL if .env exists, otherwise create it
  if (envContent.trim()) {
    envContent += '\n\n# Database Configuration\n';
  } else {
    envContent = '# Database Configuration\n';
  }
  
  // Default to a local PostgreSQL connection
  envContent += 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/morpankh_saree?schema=public"\n';
  
  // Check for other required variables
  if (!envContent.includes('JWT_SECRET=')) {
    envContent += '\n# JWT Configuration\n';
    envContent += 'JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"\n';
    envContent += 'JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"\n';
  }
  
  if (!envContent.includes('PORT=')) {
    envContent += '\n# Server Configuration\n';
    envContent += 'PORT=10000\n';
    envContent += 'NODE_ENV=development\n';
  }
  
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ .env file updated with DATABASE_URL');
  console.log('⚠️  Please update DATABASE_URL with your actual database connection string!');
} else {
  console.log('✅ DATABASE_URL already exists in .env file');
}

// Create .env.example if it doesn't exist
if (!fs.existsSync(envExamplePath)) {
  const exampleContent = `# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/morpankh_saree?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"

# Server Configuration
PORT=10000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Payment Gateway (Razorpay) - Optional
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""

# Redis Configuration - Optional (defaults to localhost:6379)
REDIS_URL="redis://localhost:6379"
`;
  fs.writeFileSync(envExamplePath, exampleContent, 'utf8');
  console.log('✅ Created .env.example file');
}

console.log('\n📋 Next steps:');
console.log('1. Update DATABASE_URL in .env with your actual PostgreSQL connection string');
console.log('2. Update JWT_SECRET and JWT_REFRESH_SECRET with secure random strings');
console.log('3. Run: npm run prisma:migrate (to set up the database schema)');
console.log('4. Run: npm start (to start the server)');

