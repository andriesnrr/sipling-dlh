import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@sipling.go.id';
  const existingAdmin = await prisma.siplingUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.siplingUser.create({
      data: {
        name: 'Pemerintah Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '08123456789',
        role: 'ADMIN',
      },
    });
    console.log('Admin account created successfully:', admin.email);
  } else {
    console.log('Admin account already exists:', existingAdmin.email);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
