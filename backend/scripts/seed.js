const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.review.deleteMany();
    await prisma.stockLog.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Existing data cleared\n');

    // 1. Create Admin User
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@morpankhsaree.com',
        phone: '+919876543210',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
      },
    });
    console.log(`✅ Admin created: ${admin.email}\n`);

    // 2. Create Sample Customer
    console.log('👤 Creating sample customer...');
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customer = await prisma.user.create({
      data: {
        email: 'customer@example.com',
        phone: '+919876543211',
        name: 'John Doe',
        password: customerPassword,
        role: 'CUSTOMER',
        isVerified: true,
      },
    });
    console.log(`✅ Customer created: ${customer.email}\n`);

    // 3. Create Categories
    console.log('📁 Creating categories...');
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Silk Sarees',
          slug: 'silk-sarees',
          description: 'Premium silk sarees for special occasions',
          image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500',
          isActive: true,
          order: 1,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Cotton Sarees',
          slug: 'cotton-sarees',
          description: 'Comfortable cotton sarees for daily wear',
          image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500',
          isActive: true,
          order: 2,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Designer Sarees',
          slug: 'designer-sarees',
          description: 'Exclusive designer sarees with intricate work',
          image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
          isActive: true,
          order: 3,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Bridal Sarees',
          slug: 'bridal-sarees',
          description: 'Luxurious bridal sarees for your special day',
          image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
          isActive: true,
          order: 4,
        },
      }),
    ]);
    console.log(`✅ Created ${categories.length} categories\n`);

    // 4. Create Products with Color Images
    console.log('🛍️ Creating products...');
    
    const products = [
      {
        name: 'Banarasi Silk Saree',
        slug: 'banarasi-silk-saree',
        description: 'Authentic Banarasi silk saree with intricate zari work. Perfect for weddings and special occasions.',
        shortDescription: 'Premium Banarasi silk with zari work',
        sku: 'BAN-SILK-001',
        barcode: '1234567890123',
        categoryId: categories[0].id,
        basePrice: 15000,
        compareAtPrice: 20000,
        costPrice: 10000,
        images: [
          'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
        ],
        colorImages: [
          {
            color: 'Red',
            images: [
              'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
              'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
              'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800',
            ],
            isActive: true,
            order: 1,
          },
          {
            color: 'Maroon',
            images: [
              'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
              'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
            ],
            isActive: true,
            order: 2,
          },
          {
            color: 'Gold',
            images: [
              'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800',
              'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
            ],
            isActive: true,
            order: 3,
          },
        ],
        fabricType: 'Silk',
        sareeLength: 6.5,
        blouseIncluded: true,
        isActive: true,
        isFeatured: true,
        showInPremium: true,
        showInTrending: true,
        showInCategories: true,
        tags: ['banarasi', 'silk', 'wedding', 'premium'],
      },
      {
        name: 'Cotton Handloom Saree',
        slug: 'cotton-handloom-saree',
        description: 'Comfortable cotton handloom saree perfect for daily wear. Soft fabric with traditional patterns.',
        shortDescription: 'Comfortable cotton handloom',
        sku: 'COT-HAND-001',
        barcode: '1234567890124',
        categoryId: categories[1].id,
        basePrice: 2500,
        compareAtPrice: 3500,
        costPrice: 1500,
        images: [
          'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800',
        ],
        colorImages: [
          {
            color: 'Blue',
            images: [
              'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800',
              'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
            ],
            isActive: true,
            order: 1,
          },
          {
            color: 'Green',
            images: [
              'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
              'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800',
            ],
            isActive: true,
            order: 2,
          },
        ],
        fabricType: 'Cotton',
        sareeLength: 6,
        blouseIncluded: false,
        isActive: true,
        isFeatured: false,
        showInPremium: false,
        showInTrending: true,
        showInCategories: true,
        tags: ['cotton', 'handloom', 'daily-wear'],
      },
      {
        name: 'Designer Embroidered Saree',
        slug: 'designer-embroidered-saree',
        description: 'Exclusive designer saree with intricate embroidery work. A statement piece for special occasions.',
        shortDescription: 'Designer saree with embroidery',
        sku: 'DES-EMB-001',
        barcode: '1234567890125',
        categoryId: categories[2].id,
        basePrice: 25000,
        compareAtPrice: 35000,
        costPrice: 18000,
        images: [
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
        ],
        colorImages: [
          {
            color: 'Pink',
            images: [
              'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
              'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
              'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800',
            ],
            isActive: true,
            order: 1,
          },
          {
            color: 'Purple',
            images: [
              'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
              'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
            ],
            isActive: true,
            order: 2,
          },
        ],
        fabricType: 'Silk',
        sareeLength: 6.5,
        blouseIncluded: true,
        isActive: true,
        isFeatured: true,
        showInPremium: true,
        showInTrending: false,
        showInCategories: true,
        tags: ['designer', 'embroidered', 'premium'],
      },
      {
        name: 'Bridal Lehenga Saree',
        slug: 'bridal-lehenga-saree',
        description: 'Luxurious bridal lehenga saree with heavy zari and stone work. Perfect for your wedding day.',
        shortDescription: 'Luxurious bridal lehenga saree',
        sku: 'BRD-LEH-001',
        barcode: '1234567890126',
        categoryId: categories[3].id,
        basePrice: 50000,
        compareAtPrice: 75000,
        costPrice: 35000,
        images: [
          'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
        ],
        colorImages: [
          {
            color: 'Red',
            images: [
              'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
              'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
              'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800',
              'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
            ],
            isActive: true,
            order: 1,
          },
          {
            color: 'Maroon',
            images: [
              'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
              'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
            ],
            isActive: true,
            order: 2,
          },
        ],
        fabricType: 'Silk',
        sareeLength: 6.5,
        blouseIncluded: true,
        isActive: true,
        isFeatured: true,
        showInPremium: true,
        showInTrending: true,
        showInCategories: true,
        tags: ['bridal', 'lehenga', 'wedding', 'premium'],
      },
    ];

    const createdProducts = [];
    for (const productData of products) {
      const product = await prisma.product.create({
        data: productData,
      });
      createdProducts.push(product);
      console.log(`  ✅ Created: ${product.name}`);
    }
    console.log(`✅ Created ${createdProducts.length} products\n`);

    // 5. Create Inventory
    console.log('📦 Creating inventory...');
    for (const product of createdProducts) {
      // Create inventory for each color
      const colorImages = Array.isArray(product.colorImages) ? product.colorImages : [];
      if (colorImages && colorImages.length > 0) {
        for (const colorData of colorImages) {
          await prisma.inventory.create({
            data: {
              productId: product.id,
              colorName: colorData.color,
              type: 'ONLINE',
              quantity: Math.floor(Math.random() * 50) + 10, // Random between 10-60
            },
          });
        }
      } else {
        // If no colors, create general inventory
        await prisma.inventory.create({
          data: {
            productId: product.id,
            type: 'ONLINE',
            quantity: Math.floor(Math.random() * 50) + 10,
          },
        });
      }
    }
    console.log('✅ Inventory created\n');

    // 6. Create Sample Order
    console.log('📋 Creating sample order...');
    const orderNumber = `ORD-${Date.now()}`;
    const order = await prisma.order.create({
      data: {
        userId: customer.id,
        orderNumber,
        status: 'CONFIRMED',
        subtotal: 15000,
        discount: 0,
        tax: 2700,
        shipping: 100,
        total: 17800,
        paymentStatus: 'PAID',
        paymentMethod: 'RAZORPAY',
        shippingAddress: {
          name: 'John Doe',
          phone: '+919876543211',
          addressLine1: '123 Main Street',
          addressLine2: 'Apt 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
        },
        billingAddress: {
          name: 'John Doe',
          phone: '+919876543211',
          addressLine1: '123 Main Street',
          addressLine2: 'Apt 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
        },
        items: {
          create: {
            productId: createdProducts[0].id,
            quantity: 1,
            price: 15000,
            total: 15000,
            colorName: 'Red',
          },
        },
        payments: {
          create: {
            amount: 17800,
            status: 'PAID',
            method: 'RAZORPAY',
            razorpayOrderId: `order_${Date.now()}`,
            razorpayPaymentId: `pay_${Date.now()}`,
          },
        },
      },
    });
    console.log(`✅ Order created: ${order.orderNumber}\n`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Admin User: ${admin.email} (password: admin123)`);
    console.log(`  - Customer: ${customer.email} (password: customer123)`);
    console.log(`  - Categories: ${categories.length}`);
    console.log(`  - Products: ${createdProducts.length}`);
    console.log(`  - Orders: 1`);
    console.log('\n✅ You can now login with admin credentials!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .then(() => {
    console.log('\n✅ Seeding process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding process failed:', error);
    process.exit(1);
  });

