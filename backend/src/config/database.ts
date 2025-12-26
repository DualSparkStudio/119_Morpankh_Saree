import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// Helper function to check if database is available
let dbAvailable: boolean | null = null;
let dbCheckPromise: Promise<boolean> | null = null;

export const isDatabaseAvailable = async (): Promise<boolean> => {
  if (dbAvailable !== null) return dbAvailable;
  
  if (dbCheckPromise) return dbCheckPromise;
  
  dbCheckPromise = (async () => {
    try {
      if (!process.env.DATABASE_URL) {
        dbAvailable = false;
        return false;
      }
      await prisma.$queryRaw`SELECT 1`;
      dbAvailable = true;
      return true;
    } catch (error) {
      dbAvailable = false;
      return false;
    }
  })();
  
  return dbCheckPromise;
};

