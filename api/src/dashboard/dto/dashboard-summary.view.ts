import { ApiProperty } from '@nestjs/swagger'
import { AssetBalanceStrategyView } from './asset-balance-strategy.view'
import { TickerHoldingView } from './ticker-holding.view'
import { PortfolioHistoryView } from './portfolio-history.view'

export class DashboardSummaryView {
  @ApiProperty({ example: 50000.00, description: 'Total amount invested in variable income' })
  variableIncomeTotalInvested: number

  @ApiProperty({ example: 55000.00, description: 'Current total balance of variable income' })
  variableIncomeTotalBalance: number

  @ApiProperty({ example: 30000.00, description: 'Total balance in shares (stocks)' })
  shareTotalBalance: number

  @ApiProperty({ example: 10000.00, description: 'Total balance in REITs' })
  reitTotalBalance: number

  @ApiProperty({ example: 5000.00, description: 'Total balance in international assets' })
  internationalTotalBalance: number

  @ApiProperty({ example: 3000.00, description: 'Total balance in gold' })
  goldTotalBalance: number

  @ApiProperty({ example: 2000.00, description: 'Total balance in crypto' })
  cryptoTotalBalance: number

  @ApiProperty({ example: 5000.00, description: 'Total balance in generic variable income (ETFs, etc)' })
  genericVariableIncomeTotalBalance: number

  @ApiProperty({ example: 15000.00, description: 'Total balance in cash boxes' })
  cashTotalBalance: number

  @ApiProperty({ example: 20000.00, description: 'Total balance in pension funds' })
  pensionTotalBalance: number

  @ApiProperty({ example: 40000.00, description: 'Total balance in fixed income' })
  fixedIncomeTotalBalance: number

  @ApiProperty({ example: 200000.00, description: 'Total balance in properties' })
  propertyTotalBalance: number

  @ApiProperty({ example: 5000.00, description: 'Total balance in other assets' })
  otherTotalBalance: number

  @ApiProperty({ example: 335000.00, description: 'Total portfolio balance' })
  totalBalance: number

  @ApiProperty({ type: AssetBalanceStrategyView, description: 'Asset balance strategy', nullable: true })
  assetBalanceStrategy: AssetBalanceStrategyView | null

  @ApiProperty({ type: AssetBalanceStrategyView, description: 'Current asset balance distribution in percentages' })
  assetCurrentBalance: AssetBalanceStrategyView

  @ApiProperty({ type: [TickerHoldingView], description: 'List of ticker holdings' })
  tickersHoldings: TickerHoldingView[]

  @ApiProperty({ type: [PortfolioHistoryView], description: 'Last 24 portfolio history snapshots' })
  history: PortfolioHistoryView[]
}
