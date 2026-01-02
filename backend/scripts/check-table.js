const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTable() {
  try {
    // Try to query the ProductColor table
    const count = await prisma.productColor.count();
    console.log(`✅ ProductColor table exists! Current record count: ${count}`);
    
    // Try to get table structure
    const sample = await prisma.productColor.findFirst();
    console.log('✅ Table structure is correct');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'P2021' || error.message.includes('does not exist')) {
      console.log('❌ ProductColor table does NOT exist in database');
      console.log('Run: npx prisma db push');
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkTable();

