import { getSeedData } from './seeders';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const seedDb = async (): Promise<void> => {
  try {
    const seedData = await getSeedData();

    await prisma.$transaction(
      async (tx) => {
        for (const group of seedData) {
          for (const item of group.data) {
            try {
              const model = (tx as Record<string, unknown>)[group.__type] as {
                findUnique: (args: {
                  where: { id: string };
                }) => Promise<unknown>;
                create: (args: { data: unknown }) => Promise<unknown>;
                update: (args: {
                  where: { id: string };
                  data: unknown;
                }) => Promise<unknown>;
              };

              if (item.id && typeof item.id === 'string') {
                const existingRecord = await model.findUnique({
                  where: { id: item.id },
                });

                if (existingRecord) {
                  await model.update({
                    where: { id: item.id },
                    data: item,
                  });
                  console.log(`Updated record with ID ${item.id}`);
                  continue;
                }
              }

              await model.create({ data: item });
            } catch (itemError) {
              console.error(
                `Error seeding item ${JSON.stringify(item)}: ${itemError}`
              );
            }
          }
        }
      },
      { maxWait: 5000, timeout: 60000 }
    );
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
};
