import { ApiProperty } from '@nestjs/swagger'

export class AssetBalanceStrategyView {
  @ApiProperty({ example: 'cuid123', description: 'Strategy ID' })
  id: string

  @ApiProperty({ example: 'user123', description: 'User ID' })
  userId: string

  @ApiProperty({ example: 'My investment strategy notes', description: 'Strategy notes', nullable: true })
  notes: string | null

  @ApiProperty({ example: 10.00, description: 'Cash box percentage' })
  cashBox: number

  @ApiProperty({ example: 20.00, description: 'Fixed income percentage' })
  fixedIncome: number

  @ApiProperty({ example: 30.00, description: 'Variable income percentage' })
  variableIncome: number

  @ApiProperty({ example: 10.00, description: 'Pension percentage' })
  pension: number

  @ApiProperty({ example: 10.00, description: 'Property percentage' })
  property: number

  @ApiProperty({ example: 15.00, description: 'Share percentage' })
  share: number

  @ApiProperty({ example: 10.00, description: 'REIT percentage' })
  reit: number

  @ApiProperty({ example: 10.00, description: 'International assets percentage' })
  international: number

  @ApiProperty({ example: 5.00, description: 'Gold percentage' })
  gold: number

  @ApiProperty({ example: 5.00, description: 'Crypto percentage' })
  crypto: number

  @ApiProperty({ example: 5.00, description: 'Other assets percentage' })
  other: number

  @ApiProperty({ example: '2026-03-16T00:00:00.000Z', description: 'Creation date' })
  createdAt: Date

  @ApiProperty({ example: '2026-03-16T00:00:00.000Z', description: 'Last update date' })
  updatedAt: Date
}
