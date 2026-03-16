import { ApiProperty } from '@nestjs/swagger'

export class TickerHoldingView {
  @ApiProperty({ example: 'AAPL34', description: 'Ticker symbol' })
  symbol: string

  @ApiProperty({ example: 'Apple Inc.', description: 'Ticker name' })
  name: string

  @ApiProperty({ example: 'STOCK', description: 'Ticker type' })
  type: string

  @ApiProperty({ example: 100, description: 'Quantity of shares' })
  quantity: number

  @ApiProperty({ example: 50.25, description: 'Average purchase price' })
  avgPrice: number

  @ApiProperty({ example: 55.50, description: 'Current market price' })
  currentPrice: number

  @ApiProperty({ example: 5550.00, description: 'Total current value' })
  totalValue: number

  @ApiProperty({ example: 5025.00, description: 'Total invested amount' })
  invested: number

  @ApiProperty({ example: 525.00, description: 'Profit or loss in currency' })
  profitLoss: number

  @ApiProperty({ example: 10.45, description: 'Profit or loss percentage' })
  profitLossPercent: number
}
