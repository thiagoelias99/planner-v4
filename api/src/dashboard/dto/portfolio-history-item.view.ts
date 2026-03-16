import { ApiProperty } from '@nestjs/swagger'

export class PortfolioHistoryItemView {
  @ApiProperty({ example: 'cuid123', description: 'History item ID' })
  id: string

  @ApiProperty({ example: 'cuid456', description: 'Portfolio history ID' })
  portfolioHistoryId: string

  @ApiProperty({ example: 'fixedincome123', description: 'Fixed income reference ID', nullable: true })
  fixedIncomeId: string | null

  @ApiProperty({ example: 'otherasset123', description: 'Other asset reference ID', nullable: true })
  otherAssetId: string | null

  @ApiProperty({ example: 'FIXED_INCOME', description: 'Asset type' })
  type: string

  @ApiProperty({ example: 'CDB Bank 2026', description: 'Asset description' })
  description: string

  @ApiProperty({ example: 'Bank XYZ', description: 'Agency name', nullable: true })
  agency: string | null

  @ApiProperty({ example: 'Additional notes', description: 'Notes', nullable: true })
  note: string | null

  @ApiProperty({ example: 10000.00, description: 'Asset value' })
  value: number

  @ApiProperty({ example: '2026-12-31T00:00:00.000Z', description: 'Due date for fixed income', nullable: true })
  dueDate: Date | null

  @ApiProperty({ example: 12.50, description: 'Fixed rate percentage', nullable: true })
  fixedRate: number | null

  @ApiProperty({ example: 'CDI', description: 'Post-fixed index', nullable: true })
  posFixedIndex: string | null

  @ApiProperty({ example: '2026-03-16T00:00:00.000Z', description: 'Creation date' })
  createdAt: Date
}
