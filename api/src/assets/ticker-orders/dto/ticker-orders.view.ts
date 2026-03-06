import { ApiProperty } from "@nestjs/swagger"

export enum ETickerOrderType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export interface ITickerOrderView {
  id: string
  userId: string
  ticker: string
  type: ETickerOrderType
  quantity: number
  price: number
  createdAt: Date
  updatedAt: Date
}

export class TickerOrderView implements ITickerOrderView {
  constructor(data: ITickerOrderView) {
    Object.assign(this, data)

    this.createdAt = new Date(data.createdAt)
    this.updatedAt = new Date(data.updatedAt)
  }

  @ApiProperty({ example: 'clxyz1234567890' })
  id: string

  @ApiProperty({ example: 'user123' })
  userId: string

  @ApiProperty({ example: 'PETR4' })
  ticker: string

  @ApiProperty({ example: ETickerOrderType.BUY, enum: ETickerOrderType })
  type: ETickerOrderType

  @ApiProperty({ example: 100 })
  quantity: number

  @ApiProperty({ example: 40.92 })
  price: number

  @ApiProperty({ example: new Date() })
  createdAt: Date

  @ApiProperty({ example: new Date() })
  updatedAt: Date
}

export class PaginatedTickerOrderView {
  constructor(data: {
    page: number
    limit: number
    total: number
    tickerOrders: TickerOrderView[]
  }) {
    this.page = data.page
    this.limit = data.limit
    this.total = data.total
    this.totalPages = Math.ceil(data.total / data.limit)
    this.data = data.tickerOrders
  }

  @ApiProperty({ description: "Current page number", example: 1 })
  page: number

  @ApiProperty({ description: "Number of items per page", example: 10 })
  limit: number

  @ApiProperty({ description: "Total number of items", example: 100 })
  total: number

  @ApiProperty({ description: "Total number of pages", example: 10 })
  totalPages: number

  @ApiProperty({ description: "List of ticker orders for the current page", type: [TickerOrderView] })
  data: TickerOrderView[]
}
