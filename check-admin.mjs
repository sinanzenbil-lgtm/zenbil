import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const admins = await prisma.admin.findMany();
    console.log('Admins in database:', JSON.stringify(admins, null, 2));
    
    const targetAdmin = await prisma.admin.findUnique({
      where: { email: 'admin@carbreeze.com' }
    });
    
    if (targetAdmin) {
      console.log('\n✅ Admin found:', targetAdmin.email);
      console.log('Password hash:', targetAdmin.password.substring(0, 20) + '...');
    } else {
      console.log('\n❌ Admin NOT found with email: admin@carbreeze.com');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();

