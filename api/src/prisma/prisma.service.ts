import { Injectable } from '@nestjs/common'
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

@Injectable()
export class PrismaService extends PrismaClient {
  private static instance: PrismaService

  constructor() {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set.")
    }

    const adapter = new PrismaPg({ connectionString })
    super({ adapter })
  }

  public static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService()
    }
    return PrismaService.instance as PrismaService
  }

  async onModuleInit() {
    await this.$connect()
  }
}
