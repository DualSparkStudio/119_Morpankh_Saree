require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = process.argv[2] || 'admin@morpankhsaree.com';
    const password = process.argv[3] || 'Admin@123';
    const name = process.argv[4] || 'Admin User';

    console.log('🔐 Creating admin user...');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${name}`);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // Update existing user to admin
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          role: 'ADMIN',
          password: hashedPassword,
          isVerified: true,
        }
      });
      console.log('✅ Existing user updated to ADMIN role!');
      console.log(`   User ID: ${updatedUser.id}`);
      return;
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   User ID: ${adminUser.id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log('\n📝 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === 'P2002') {
      console.error('   User with this email already exists');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

