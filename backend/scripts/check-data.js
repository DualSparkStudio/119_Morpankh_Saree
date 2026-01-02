const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('Checking database data...\n');
    
    // Check products
    const productCount = await prisma.product.count();
    console.log(`✅ Products: ${productCount}`);
    
    // Check product colors
    const colorCount = await prisma.productColor.count();
    console.log(`✅ Product Colors: ${colorCount}`);
    
    if (colorCount > 0) {
      const sampleColor = await prisma.productColor.findFirst({
        include: { product: { select: { name: true } } }
      });
      console.log(`\nSample Color:`, {
        id: sampleColor.id,
        product: sampleColor.product.name,
        color: sampleColor.color,
        imagesCount: sampleColor.images.length
      });
    }
    
    // Check orders
    const orderCount = await prisma.order.count();
    console.log(`✅ Orders: ${orderCount}`);
    
    // Check users
    const userCount = await prisma.user.count();
    console.log(`✅ Users: ${userCount}`);
    
    // Check categories
    const categoryCount = await prisma.category.count();
    console.log(`✅ Categories: ${categoryCount}`);
    
    console.log('\n✅ All data is intact!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking data:', error.message);
    if (error.code === 'P2021') {
      console.error('Table does not exist - data may have been lost');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();

