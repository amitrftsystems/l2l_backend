import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create Superadmin
  const superadminPassword = await bcrypt.hash('superadmin123', 10);
  const superadmin = await prisma.user.upsert({
    where: { email: 'superadmin@hlcity.com' },
    update: {},
    create: {
      userId: 'SUPER001',
      email: 'superadmin@hlcity.com',
      password: superadminPassword,
      name: 'Super Admin',
      role: 'SUPERADMIN',
    },
  });

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hlcity.com' },
    update: {},
    create: {
      userId: 'ADMIN001',
      email: 'admin@hlcity.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      createdById: superadmin.id,
    },
  });

  // Create Employee
  const employeePassword = await bcrypt.hash('employee123', 10);
  await prisma.user.upsert({
    where: { email: 'employee@hlcity.com' },
    update: {},
    create: {
      userId: 'EMP001',
      email: 'employee@hlcity.com',
      password: employeePassword,
      name: 'Employee User',
      role: 'EMPLOYEE',
      createdById: admin.id,
    },
  });

  console.log('Demo users created successfully!');
  console.log('\nDemo Credentials:');
  console.log('----------------');
  console.log('Superadmin:');
  console.log('Email: superadmin@hlcity.com');
  console.log('User ID: SUPER001');
  console.log('Password: superadmin123');
  console.log('\nAdmin:');
  console.log('Email: admin@hlcity.com');
  console.log('User ID: ADMIN001');
  console.log('Password: admin123');
  console.log('\nEmployee:');
  console.log('Email: employee@hlcity.com');
  console.log('User ID: EMP001');
  console.log('Password: employee123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 