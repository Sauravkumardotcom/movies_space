import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL (Prisma) connected successfully');
    return prisma;
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL via Prisma:', error.message);
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Prisma client disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting Prisma client:', error.message);
    throw error;
  }
};

export const checkDBHealth = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return 'connected';
  } catch (error) {
    console.error('❌ Database health check failed:', error.message);
    return 'disconnected';
  }
};

export default prisma;
