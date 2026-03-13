import { Module } from '@nestjs/common'
import { AssetBalanceStrategyService } from './asset-balance-strategy.service'
import { AssetBalanceStrategyController } from './asset-balance-strategy.controller'
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AssetBalanceStrategyController],
  providers: [AssetBalanceStrategyService],
})
export class AssetBalanceStrategyModule { }
