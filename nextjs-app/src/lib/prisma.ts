import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client optimized for serverless (Vercel)
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

// Handle connection errors gracefully
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
