// import { PrismaClient } from '@prisma/client'

// const globalForPrisma = global as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ['warn', 'error'],
//   })

// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prisma = prisma
// }


// lib/prisma.ts - Render SQLite configuration
import { PrismaClient } from '@prisma/client'
import path from 'path'

// Determine the database path based on environment
function getDatabasePath() {
  if (process.env.RENDER) {
    // On Render, use the persistent disk
    return '/var/data/dev.db'
  } else if (process.env.VERCEL) {
    // On Vercel, use /tmp (ephemeral)
    return '/tmp/dev.db'
  } else {
    // Local development
    return path.join(process.cwd(), 'prisma/dev.db')
  }
}

const databasePath = getDatabasePath()
const databaseUrl = `file:${databasePath}`

// Set DATABASE_URL for Prisma
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['error', 'warn'] 
    : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
