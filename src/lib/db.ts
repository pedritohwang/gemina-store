import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Real Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Legacy JSON DB functions (for migration purposes)
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) return { products: [], users: [], categories: [], banners: [], faq: [], brandInfo: {} };
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { products: [], users: [], categories: [], banners: [], faq: [], brandInfo: {} };
  }
}

// Compatibility functions for existing code
export async function getProducts() {
  return await prisma.product.findMany();
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({ where: { id } });
}
