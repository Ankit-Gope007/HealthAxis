// import { PrismaClient } from '@prisma/client/extension'

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ['query'],
//   })

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


// lib/prisma.ts
// import { PrismaClient } from "@prisma/client"

// export const prisma = globalThis.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma