import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class AssetBalanceStrategyView {
  @ApiProperty()
  id: string

  @ApiProperty()
  userId: string

  @ApiPropertyOptional()
  notes?: string

  @ApiProperty()
  cashBox: number

  @ApiProperty()
  fixedIncome: number

  @ApiProperty()
  variableIncome: number

  @ApiProperty()
  pension: number

  @ApiProperty()
  property: number

  @ApiProperty()
  share: number

  @ApiProperty()
  reit: number

  @ApiProperty()
  international: number

  @ApiProperty()
  gold: number

  @ApiProperty()
  crypto: number

  @ApiProperty()
  other: number

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
