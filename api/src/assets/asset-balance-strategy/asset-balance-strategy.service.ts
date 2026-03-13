import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { UpdateAssetBalanceStrategyInput } from './dto/update-asset-balance-strategy.input'
import { AssetBalanceStrategyView } from './dto/asset-balance-strategy.view'
import { AssetBalanceStrategy, Prisma } from '../../generated/prisma/client'

export function prismaAssetBalanceStrategyToAssetBalanceStrategyView(
  assetBalanceStrategy: AssetBalanceStrategy
): AssetBalanceStrategyView {
  return {
    id: assetBalanceStrategy.id,
    userId: assetBalanceStrategy.userId,
    notes: assetBalanceStrategy.notes || undefined || "",
    cashBox: assetBalanceStrategy.cashBox.toNumber(),
    fixedIncome: assetBalanceStrategy.fixedIncome.toNumber(),
    variableIncome: assetBalanceStrategy.variableIncome.toNumber(),
    pension: assetBalanceStrategy.pension.toNumber(),
    property: assetBalanceStrategy.property.toNumber(),
    share: assetBalanceStrategy.share.toNumber(),
    reit: assetBalanceStrategy.reit.toNumber(),
    international: assetBalanceStrategy.international.toNumber(),
    gold: assetBalanceStrategy.gold.toNumber(),
    crypto: assetBalanceStrategy.crypto.toNumber(),
    other: assetBalanceStrategy.other.toNumber(),
    createdAt: assetBalanceStrategy.createdAt,
    updatedAt: assetBalanceStrategy.updatedAt,
  }
}

@Injectable()
export class AssetBalanceStrategyService {
  private readonly logger = new Logger(AssetBalanceStrategyService.name);

  constructor(private readonly prisma: PrismaService) { }

  async getStrategy(userId: string): Promise<AssetBalanceStrategyView> {
    try {
      let strategy = await this.prisma.assetBalanceStrategy.findUnique({
        where: { userId },
      })

      if (!strategy) {
        // Create default strategy
        strategy = await this.prisma.assetBalanceStrategy.create({
          data: {
            userId,
          },
        })
      }

      return prismaAssetBalanceStrategyToAssetBalanceStrategyView(strategy)
    } catch (error) {
      this.logger.error(`Error fetching asset balance strategy for user ${userId}`, error)
      throw new InternalServerErrorException('Error fetching asset balance strategy')
    }
  }

  async updateStrategy(
    userId: string,
    updateData: UpdateAssetBalanceStrategyInput,
  ): Promise<AssetBalanceStrategyView> {
    // Validate that the sum is exactly 100
    const sum =
      updateData.cashBox +
      updateData.fixedIncome +
      updateData.variableIncome +
      updateData.pension +
      updateData.property +
      updateData.share +
      updateData.reit +
      updateData.international +
      updateData.gold +
      updateData.crypto +
      updateData.other

    if (Math.abs(sum - 100) > 0.001) {
      throw new BadRequestException('A soma de todos os ativos deve ser exatamente 100%')
    }

    try {
      const strategy = await this.prisma.assetBalanceStrategy.upsert({
        where: { userId },
        update: {
          notes: updateData.notes,
          cashBox: new Prisma.Decimal(updateData.cashBox),
          fixedIncome: new Prisma.Decimal(updateData.fixedIncome),
          variableIncome: new Prisma.Decimal(updateData.variableIncome),
          pension: new Prisma.Decimal(updateData.pension),
          property: new Prisma.Decimal(updateData.property),
          share: new Prisma.Decimal(updateData.share),
          reit: new Prisma.Decimal(updateData.reit),
          international: new Prisma.Decimal(updateData.international),
          gold: new Prisma.Decimal(updateData.gold),
          crypto: new Prisma.Decimal(updateData.crypto),
          other: new Prisma.Decimal(updateData.other),
        },
        create: {
          userId,
          notes: updateData.notes,
          cashBox: new Prisma.Decimal(updateData.cashBox),
          fixedIncome: new Prisma.Decimal(updateData.fixedIncome),
          variableIncome: new Prisma.Decimal(updateData.variableIncome),
          pension: new Prisma.Decimal(updateData.pension),
          property: new Prisma.Decimal(updateData.property),
          share: new Prisma.Decimal(updateData.share),
          reit: new Prisma.Decimal(updateData.reit),
          international: new Prisma.Decimal(updateData.international),
          gold: new Prisma.Decimal(updateData.gold),
          crypto: new Prisma.Decimal(updateData.crypto),
          other: new Prisma.Decimal(updateData.other),
        },
      })

      return prismaAssetBalanceStrategyToAssetBalanceStrategyView(strategy)
    } catch (error) {
      this.logger.error(`Error updating asset balance strategy for user ${userId}`, error)
      throw new InternalServerErrorException('Failed to update asset balance strategy')
    }
  }
}
