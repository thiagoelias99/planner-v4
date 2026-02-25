import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaService } from "../prisma/prisma.service"

export const auth = betterAuth({
  database: prismaAdapter(PrismaService.getInstance(), {
    provider: "sqlite",
  }),
})