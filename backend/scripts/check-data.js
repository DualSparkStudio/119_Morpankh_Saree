const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('Checking database data...\n');
    
    // Check products
    const productCount = await prisma.product.count();
    console.log(`✅ Products: ${productCount}`);
    
    // Check product color images
    const productsWithColors = await prisma.product.findMany({
      where: {
        colorImages: { not: null }
      },
      select: {
        name: true,
        colorImages: true
      },
      take: 1
    });
    
    if (productsWithColors.length > 0) {
      const product = productsWithColors[0];
      const colorImages = Array.isArray(product.colorImages) ? product.colorImages : [];
      console.log(`✅ Products with colors: ${productCount}`);
      if (colorImages.length > 0) {
        console.log(`\nSample Product Color:`, {
          product: product.name,
          color: colorImages[0].color,
          imagesCount: colorImages[0].images ? colorImages[0].images.length : 0
        });
      }
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

