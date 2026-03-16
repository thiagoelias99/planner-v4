import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CustomLogger } from '../utils/logger'

@Injectable()
export class DashboardService {
  private readonly logger = new CustomLogger('DashboardService')

  constructor(private readonly prisma: PrismaService) { }

  async getHistory(userId: string, limit: number = 24) {
    const histories = await this.prisma.portfolioHistory.findMany({
      where: { userId },
      orderBy: { snapshotDate: 'desc' },
      take: limit,
      include: {
        PortfolioHistoryItems: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    return histories.map(history => ({
      id: history.id,
      userId: history.userId,
      snapshotDate: history.snapshotDate,
      variableIncomeTotalInvested: Number(history.variableIncomeTotalInvested),
      variableIncomeTotalBalance: Number(history.variableIncomeTotalBalance),
      shareTotalBalance: Number(history.shareTotalBalance),
      reitTotalBalance: Number(history.reitTotalBalance),
      internationalTotalBalance: Number(history.internationalTotalBalance),
      goldTotalBalance: Number(history.goldTotalBalance),
      cryptoTotalBalance: Number(history.cryptoTotalBalance),
      genericVariableIncomeTotalBalance: Number(history.genericVariableIncomeTotalBalance),
      cashTotalBalance: Number(history.cashTotalBalance),
      pensionTotalBalance: Number(history.pensionTotalBalance),
      fixedIncomeTotalBalance: Number(history.fixedIncomeTotalBalance),
      propertyTotalBalance: Number(history.propertyTotalBalance),
      otherTotalBalance: Number(history.otherTotalBalance),
      totalBalance: Number(history.totalBalance),
      assetBalanceStrategySnapshot: history.assetBalanceStrategySnapshot,
      createdAt: history.createdAt,
      items: history.PortfolioHistoryItems.map(item => ({
        id: item.id,
        portfolioHistoryId: item.portfolioHistoryId,
        fixedIncomeId: item.fixedIncomeId,
        otherAssetId: item.otherAssetId,
        type: item.type,
        description: item.description,
        agency: item.agency,
        note: item.note,
        value: Number(item.value),
        dueDate: item.dueDate,
        fixedRate: item.fixedRate ? Number(item.fixedRate) : null,
        posFixedIndex: item.posFixedIndex,
        createdAt: item.createdAt
      }))
    }))
  }

  async getSummary(userId: string) {
    // 1. Variable Income (Current & Invested)
    const latestOrders = await this.prisma.$queryRaw<{ ticker: string, name: string, type: string, new_total_quantity: number, new_mean_price: number, price: number }[]>`
      WITH RankedOrders AS (
        SELECT 
          t.ticker,
          tk.name,
          tk.type,
          t.new_total_quantity,
          t.new_mean_price,
          tk.price,
          ROW_NUMBER() OVER(PARTITION BY t.ticker ORDER BY t.created_at DESC) as rn
        FROM ticker_orders t
        JOIN tickers tk ON t.ticker = tk.symbol
        WHERE t.user_id = ${userId}
      )
      SELECT ticker, name, type, new_total_quantity, new_mean_price, price
      FROM RankedOrders
      WHERE rn = 1 AND new_total_quantity > 0
    `

    let variableIncomeTotalInvested = 0
    let variableIncomeTotalBalance = 0

    let shareTotalBalance = 0
    let reitTotalBalance = 0
    let internationalTotalBalance = 0
    let goldTotalBalance = 0
    let cryptoTotalBalance = 0
    let genericVariableIncomeTotalBalance = 0

    for (const order of latestOrders) {
      const balance = Number(order.new_total_quantity) * Number(order.price)
      variableIncomeTotalInvested += Number(order.new_total_quantity) * Number(order.new_mean_price)
      variableIncomeTotalBalance += balance

      switch (order.type) {
        case 'STOCK':
          shareTotalBalance += balance
          break
        case 'REIT':
          reitTotalBalance += balance
          break
        case 'INTERNATIONAL':
          internationalTotalBalance += balance
          break
        case 'GOLD':
          goldTotalBalance += balance
          break
        case 'CRYPTO':
          cryptoTotalBalance += balance
          break
        case 'ETF':
        default:
          genericVariableIncomeTotalBalance += balance
          break
      }
    }

    // 2. Cash Boxes
    const cashResult = await this.prisma.otherAsset.aggregate({
      where: { userId, type: 'CASH_BOX' },
      _sum: { value: true }
    })
    const cashTotalBalance = Number(cashResult._sum.value || 0)

    // 3. Pension
    const pensionResult = await this.prisma.otherAsset.aggregate({
      where: { userId, type: 'PENSION' },
      _sum: { value: true }
    })
    const pensionTotalBalance = Number(pensionResult._sum.value || 0)

    // 4. Fixed Income
    const fixedIncomeResult = await this.prisma.fixedIncome.aggregate({
      where: { userId, retrievedAt: null },
      _sum: { currentValue: true }
    })
    const fixedIncomeTotalBalance = Number(fixedIncomeResult._sum.currentValue || 0)

    // 5. Property
    const propertyResult = await this.prisma.otherAsset.aggregate({
      where: { userId, type: 'PROPERTY' },
      _sum: { value: true }
    })
    const propertyTotalBalance = Number(propertyResult._sum.value || 0)

    // 6. Other Unknown Assets
    const otherResult = await this.prisma.otherAsset.aggregate({
      where: { userId, type: 'OTHER' },
      _sum: { value: true }
    })
    const otherTotalBalance = Number(otherResult._sum.value || 0)

    const totalBalance = variableIncomeTotalBalance + cashTotalBalance + pensionTotalBalance + fixedIncomeTotalBalance + propertyTotalBalance + otherTotalBalance

    // 7. Asset Balance Strategy
    const assetBalanceStrategyRaw = await this.prisma.assetBalanceStrategy.findUnique({
      where: { userId }
    })

    const assetBalanceStrategy = assetBalanceStrategyRaw ? {
      id: assetBalanceStrategyRaw.id,
      userId: assetBalanceStrategyRaw.userId,
      notes: assetBalanceStrategyRaw.notes,
      cashBox: Number(assetBalanceStrategyRaw.cashBox),
      fixedIncome: Number(assetBalanceStrategyRaw.fixedIncome),
      variableIncome: Number(assetBalanceStrategyRaw.variableIncome),
      pension: Number(assetBalanceStrategyRaw.pension),
      property: Number(assetBalanceStrategyRaw.property),
      share: Number(assetBalanceStrategyRaw.share),
      reit: Number(assetBalanceStrategyRaw.reit),
      international: Number(assetBalanceStrategyRaw.international),
      gold: Number(assetBalanceStrategyRaw.gold),
      crypto: Number(assetBalanceStrategyRaw.crypto),
      other: Number(assetBalanceStrategyRaw.other),
      createdAt: assetBalanceStrategyRaw.createdAt,
      updatedAt: assetBalanceStrategyRaw.updatedAt
    } : null

    // 8. Format tickers holdings list
    const tickersHoldings = latestOrders.map(order => ({
      symbol: order.ticker,
      name: order.name,
      type: order.type,
      quantity: Number(order.new_total_quantity),
      avgPrice: Number(order.new_mean_price),
      currentPrice: Number(order.price),
      totalValue: Number(order.new_total_quantity) * Number(order.price),
      invested: Number(order.new_total_quantity) * Number(order.new_mean_price),
      profitLoss: (Number(order.new_total_quantity) * Number(order.price)) - (Number(order.new_total_quantity) * Number(order.new_mean_price)),
      profitLossPercent: ((Number(order.price) - Number(order.new_mean_price)) / Number(order.new_mean_price)) * 100
    }))

    // 9. Get portfolio history (last 24 snapshots)
    const history = await this.getHistory(userId, 24)

    return {
      variableIncomeTotalInvested,
      variableIncomeTotalBalance,
      shareTotalBalance,
      reitTotalBalance,
      internationalTotalBalance,
      goldTotalBalance,
      cryptoTotalBalance,
      genericVariableIncomeTotalBalance,
      cashTotalBalance,
      pensionTotalBalance,
      fixedIncomeTotalBalance,
      propertyTotalBalance,
      otherTotalBalance,
      totalBalance,
      assetBalanceStrategy,
      tickersHoldings,
      history
    }
  }

  async createHistorySnapshot(userId: string) {
    try {
      this.logger.log(`Creating portfolio history snapshot for user ${userId}`)

      // Get current portfolio summary
      const summary = await this.getSummary(userId)

      // Get active fixed incomes
      const activeFixedIncomes = await this.prisma.fixedIncome.findMany({
        where: { userId, retrievedAt: null }
      })

      // Get all other assets
      const otherAssets = await this.prisma.otherAsset.findMany({
        where: { userId }
      })

      // Create portfolio history snapshot
      const portfolioHistory = await this.prisma.portfolioHistory.create({
        data: {
          userId,
          snapshotDate: new Date(),
          variableIncomeTotalInvested: summary.variableIncomeTotalInvested,
          variableIncomeTotalBalance: summary.variableIncomeTotalBalance,
          shareTotalBalance: summary.shareTotalBalance,
          reitTotalBalance: summary.reitTotalBalance,
          internationalTotalBalance: summary.internationalTotalBalance,
          goldTotalBalance: summary.goldTotalBalance,
          cryptoTotalBalance: summary.cryptoTotalBalance,
          genericVariableIncomeTotalBalance: summary.genericVariableIncomeTotalBalance,
          cashTotalBalance: summary.cashTotalBalance,
          pensionTotalBalance: summary.pensionTotalBalance,
          fixedIncomeTotalBalance: summary.fixedIncomeTotalBalance,
          propertyTotalBalance: summary.propertyTotalBalance,
          otherTotalBalance: summary.otherTotalBalance,
          totalBalance: summary.totalBalance,
          assetBalanceStrategySnapshot: summary.assetBalanceStrategy
            ? JSON.stringify(summary.assetBalanceStrategy)
            : null
        }
      })

      // Create portfolio history items for fixed incomes
      const fixedIncomeItems = activeFixedIncomes.map(fi => ({
        portfolioHistoryId: portfolioHistory.id,
        fixedIncomeId: fi.id,
        type: 'FIXED_INCOME',
        description: fi.description,
        agency: fi.agency,
        note: fi.note,
        value: fi.currentValue,
        dueDate: fi.dueDate,
        fixedRate: fi.fixedRate,
        posFixedIndex: fi.posFixedIndex
      }))

      // Create portfolio history items for other assets
      const otherAssetItems = otherAssets.map(oa => ({
        portfolioHistoryId: portfolioHistory.id,
        otherAssetId: oa.id,
        type: oa.type,
        description: oa.description,
        agency: oa.agency,
        note: oa.note,
        value: oa.value,
        dueDate: null,
        fixedRate: null,
        posFixedIndex: null
      }))

      // Insert all items
      const allItems = [...fixedIncomeItems, ...otherAssetItems]
      if (allItems.length > 0) {
        await this.prisma.portfolioHistoryItem.createMany({
          data: allItems
        })
      }

      this.logger.log(`Portfolio history snapshot created successfully for user ${userId}: ${portfolioHistory.id}`)
      return portfolioHistory
    } catch (error) {
      const err = error as Error
      this.logger.error(`Failed to create portfolio history snapshot for user ${userId}: ${err.message}`, err.stack)
      throw error
    }
  }

  async createAllUsersSnapshot() {
    this.logger.log('Starting portfolio history snapshot for all users')

    try {
      const users = await this.prisma.user.findMany({
        select: { id: true, name: true, email: true }
      })

      this.logger.log(`Found ${users.length} users to snapshot`)

      const results = {
        total: users.length,
        successful: 0,
        failed: 0,
        errors: [] as { userId: string, email: string, error: string }[]
      }

      for (const user of users) {
        try {
          await this.createHistorySnapshot(user.id)
          results.successful++
        } catch (error) {
          const err = error as Error
          results.failed++
          results.errors.push({
            userId: user.id,
            email: user.email,
            error: err.message
          })
          this.logger.error(`Failed to create snapshot for user ${user.email}: ${err.message}`)
        }
      }

      this.logger.log(`Portfolio history snapshot completed: ${results.successful} successful, ${results.failed} failed`)
      return results
    } catch (error) {
      const err = error as Error
      this.logger.error(`Failed to create portfolio history snapshot for all users: ${err.message}`, err.stack)
      throw error
    }
  }
}
