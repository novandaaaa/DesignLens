import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const reviews = await prisma.aiReview.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 5,
  });
  console.log('Recent reviews:', JSON.stringify(reviews, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
