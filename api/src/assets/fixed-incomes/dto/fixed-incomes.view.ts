import { ApiProperty } from "@nestjs/swagger"
import { differenceInDays } from "date-fns"

export enum EPosFixedIndex {
  NONE = 'NONE',
  CDI = 'CDI',
  IPCA = 'IPCA',
  IGPM = 'IGPM',
  INPC = 'INPC',
  SELIC = 'SELIC'
}

export interface IFixedIncomeView {
  id: string
  userId: string
  description: string
  agency: string | null
  note: string | null
  initialInvestment: number
  currentValue: number
  date: Date
  dueDate: Date
  fixedRate: number
  posFixedIndex: EPosFixedIndex
  retrievedAt: Date | null
  updatedAt: Date
}

export class FixedIncomeView implements IFixedIncomeView {
  constructor(data: IFixedIncomeView) {
    Object.assign(this, data)

    this.date = new Date(data.date)
    this.dueDate = new Date(data.dueDate)
    this.retrievedAt = data.retrievedAt ? new Date(data.retrievedAt) : null
    this.updatedAt = new Date(data.updatedAt)

    this.profit = this.currentValue - this.initialInvestment
    this.profitPercentage = this.initialInvestment > 0 ? (this.profit / this.initialInvestment) * 100 : 0

    const today = new Date()
    this.pastDays = differenceInDays(today, this.date)
    this.remainingDays = differenceInDays(this.dueDate, today)
  }

  @ApiProperty({ example: 'clxyz1234567890' })
  id: string

  @ApiProperty({ example: 'user123' })
  userId: string

  @ApiProperty({ example: 'CDB Banco XYZ 120% CDI' })
  description: string

  @ApiProperty({ example: 'Banco XYZ', nullable: true })
  agency: string | null

  @ApiProperty({ example: 'Liquidez D+1', nullable: true })
  note: string | null

  @ApiProperty({ example: 10000.00 })
  initialInvestment: number

  @ApiProperty({ example: 10500.00 })
  currentValue: number

  @ApiProperty({ example: 500.00 })
  profit: number

  @ApiProperty({ example: 5.00 })
  profitPercentage: number

  @ApiProperty({ example: 30 })
  pastDays: number

  @ApiProperty({ example: 60 })
  remainingDays: number

  @ApiProperty({ example: new Date() })
  date: Date

  @ApiProperty({ example: new Date() })
  dueDate: Date

  @ApiProperty({ example: 120.00 })
  fixedRate: number

  @ApiProperty({ example: EPosFixedIndex.CDI, enum: EPosFixedIndex })
  posFixedIndex: EPosFixedIndex

  @ApiProperty({ example: new Date(), nullable: true })
  retrievedAt: Date | null

  @ApiProperty({ example: new Date() })
  updatedAt: Date
}

export class PaginatedFixedIncomeView {
  constructor(data: {
    page: number
    limit: number
    total: number
    fixedIncomes: FixedIncomeView[]
  }) {
    this.page = data.page
    this.limit = data.limit
    this.total = data.total
    this.totalPages = Math.ceil(data.total / data.limit)
    this.data = data.fixedIncomes
  }

  @ApiProperty({ description: "Current page number", example: 1 })
  page: number

  @ApiProperty({ description: "Number of items per page", example: 10 })
  limit: number

  @ApiProperty({ description: "Total number of items", example: 100 })
  total: number

  @ApiProperty({ description: "Total number of pages", example: 10 })
  totalPages: number

  @ApiProperty({ description: "List of fixed incomes for the current page", type: [FixedIncomeView] })
  data: FixedIncomeView[]
}
