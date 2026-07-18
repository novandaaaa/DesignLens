import * as dotenv from 'dotenv';
import path from 'node:path';
// Load environment variables before initializing Prisma Client
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

const pool = new Pool({ connectionString });
const prismaAdapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter: prismaAdapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ===== Seed Categories =====
  const categories = [
    { name: 'E-Commerce', slug: 'e-commerce' },
    { name: 'Portfolio', slug: 'portfolio' },
    { name: 'Landing Page', slug: 'landing-page' },
    { name: 'Blog', slug: 'blog' },
    { name: 'Dashboard', slug: 'dashboard' },
    { name: 'Company Profile', slug: 'company-profile' },
    { name: 'SaaS', slug: 'saas' },
    { name: 'Education', slug: 'education' },
    { name: 'Social Media', slug: 'social-media' },
    { name: 'News / Media', slug: 'news-media' },
    { name: 'Government', slug: 'government' },
    { name: 'Healthcare', slug: 'healthcare' },
    { name: 'Other', slug: 'other' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log(`✅ ${categories.length} categories seeded`);

  // ===== Seed Admin User =====
  const adminEmail = 'admin@designlens.id';
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Admin DesignLens',
      email: adminEmail,
      passwordHash: hashedPassword,
      role: Role.ADMIN,
    },
  });
  console.log('✅ Admin user seeded');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
