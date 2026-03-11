import { Module } from '@nestjs/common'
import { FixedIncomesService } from './fixed-incomes.service'
import { FixedIncomesController } from './fixed-incomes.controller'
import { PrismaModule } from '../../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [FixedIncomesController],
  providers: [FixedIncomesService],
})
export class FixedIncomesModule { }
