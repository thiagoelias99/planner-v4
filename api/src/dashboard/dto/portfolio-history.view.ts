import { ApiProperty } from '@nestjs/swagger'
import { PortfolioHistoryItemView } from './portfolio-history-item.view'

export class PortfolioHistoryView {
  @ApiProperty({ example: 'cuid123', description: 'Portfolio history ID' })
  id: string

  @ApiProperty({ example: 'user123', description: 'User ID' })
  userId: string

  @ApiProperty({ example: '2026-03-15T00:00:00.000Z', description: 'Snapshot date' })
  snapshotDate: Date

  @ApiProperty({ example: 50000.00, description: 'Variable income total invested' })
  variableIncomeTotalInvested: number

  @ApiProperty({ example: 55000.00, description: 'Variable income total balance' })
  variableIncomeTotalBalance: number

  @ApiProperty({ example: 30000.00, description: 'Share total balance' })
  shareTotalBalance: number

  @ApiProperty({ example: 10000.00, description: 'REIT total balance' })
  reitTotalBalance: number

  @ApiProperty({ example: 5000.00, description: 'International total balance' })
  internationalTotalBalance: number

  @ApiProperty({ example: 3000.00, description: 'Gold total balance' })
  goldTotalBalance: number

  @ApiProperty({ example: 2000.00, description: 'Crypto total balance' })
  cryptoTotalBalance: number

  @ApiProperty({ example: 5000.00, description: 'Generic variable income total balance' })
  genericVariableIncomeTotalBalance: number

  @ApiProperty({ example: 15000.00, description: 'Cash total balance' })
  cashTotalBalance: number

  @ApiProperty({ example: 20000.00, description: 'Pension total balance' })
  pensionTotalBalance: number

  @ApiProperty({ example: 40000.00, description: 'Fixed income total balance' })
  fixedIncomeTotalBalance: number

  @ApiProperty({ example: 200000.00, description: 'Property total balance' })
  propertyTotalBalance: number

  @ApiProperty({ example: 5000.00, description: 'Other assets total balance' })
  otherTotalBalance: number

  @ApiProperty({ example: 335000.00, description: 'Total portfolio balance' })
  totalBalance: number

  @ApiProperty({ example: '{"cashBox":10,"fixedIncome":20,...}', description: 'Asset balance strategy snapshot as JSON', nullable: true })
  assetBalanceStrategySnapshot: string | null

  @ApiProperty({ example: '2026-03-16T00:00:00.000Z', description: 'Creation date' })
  createdAt: Date

  @ApiProperty({ type: [PortfolioHistoryItemView], description: 'Portfolio history items' })
  items: PortfolioHistoryItemView[]
}
