import { Module } from '@nestjs/common'
import { TickerOrdersService } from './ticker-orders.service'
import { TickerOrdersController } from './ticker-orders.controller'
import { PrismaModule } from '../../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [TickerOrdersController],
  providers: [TickerOrdersService],
})
export class TickerOrdersModule { }
