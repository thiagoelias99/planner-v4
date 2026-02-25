import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaService } from "../prisma/prisma.service"
import argon2 from "argon2"

export const auth = betterAuth({
  database: prismaAdapter(PrismaService.getInstance(), {
    provider: "postgresql",
  }),
  trustedOrigins: ["http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    password: {
      hash: async (password: string) => {
        return await argon2.hash(password)
      },
      verify: async (data: { hash: string, password: string }) => {
        return await argon2.verify(data.hash, data.password)
      }
    }
  }
})