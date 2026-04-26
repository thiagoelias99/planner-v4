import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export enum ETickerType {
  STOCK = 'STOCK',
  ETF = 'ETF',
  REIT = 'REIT',
  GOLD = 'GOLD',
  CRYPTO = 'CRYPTO',
  INTERNATIONAL = 'INTERNATIONAL'
}

export interface ITickerView {
  id: string
  name: string
  symbol: string
  cnpj?: string
  type: ETickerType
  price: number
  change?: number
  changePercent?: number
  autoUpdate: boolean
  updatedAt: Date
}

export class TickerView implements ITickerView {
  constructor(data: ITickerView) {
    Object.assign(this, data)

    this.updatedAt = new Date(data.updatedAt)
  }

  @ApiProperty({ example: 'ea951cd1-31ce-42a5-8056-466db3431e63' })
  id: string

  @ApiProperty({ example: 'Petroleo Brasileiro SA Petrobras' })
  name: string

  @ApiProperty({ example: 'PETR4' })
  symbol: string

  @ApiPropertyOptional({ example: '12.345.678/0001-90' })
  cnpj?: string

  @ApiProperty({ example: ETickerType.STOCK, enum: ETickerType })
  type: ETickerType

  @ApiProperty({ example: 40.92 })
  price: number

  @ApiPropertyOptional({ example: 1.23 })
  change?: number

  @ApiPropertyOptional({ example: 3.45 })
  changePercent?: number

  @ApiPropertyOptional({ example: true })
  autoUpdate: boolean

  @ApiProperty({ example: new Date() })
  updatedAt: Date
}

export class PaginatedTickerView {
  constructor(data: {
    page: number
    limit: number
    total: number
    tickers: TickerView[]
  }) {
    this.page = data.page
    this.limit = data.limit
    this.total = data.total
    this.totalPages = Math.ceil(data.total / data.limit)
    this.data = data.tickers
  }

  @ApiProperty({ description: "Current page number", example: 1 })
  page: number

  @ApiProperty({ description: "Number of items per page", example: 8 })
  limit: number

  @ApiProperty({ description: "Total number of items", example: 100 })
  total: number

  @ApiProperty({ description: "Total number of pages", example: 13 })
  totalPages: number

  @ApiProperty({ description: "List of tickers for the current page", type: [TickerView] })
  data: TickerView[]
}