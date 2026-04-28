import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { BudgetsRepository } from "../budgets/budgets.repository"
import { PrismaBudgetsRepository } from "../budgets/prisma-budgets.repository"

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: BudgetsRepository,
      useClass: PrismaBudgetsRepository
    }
  ],
  exports: [PrismaService, BudgetsRepository],
})
export class PrismaModule { }
