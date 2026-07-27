import { ApiProperty } from "@nestjs/swagger"
import { BudgetView } from "./budget.view"

export class PaginatedBudgetView {
  constructor(data: {
    page: number
    limit: number
    total: number
    budgetData: BudgetView
  }) {
    this.page = data.page
    this.limit = data.limit
    this.total = data.total
    this.totalPages = Math.ceil(data.total / data.limit)
    this.data = data.budgetData
  }

  @ApiProperty({ description: "Current page number", example: 1 })
  page: number

  @ApiProperty({ description: "Number of items per page", example: 16 })
  limit: number

  @ApiProperty({ description: "Total number of transaction items", example: 100 })
  total: number

  @ApiProperty({ description: "Total number of pages", example: 7 })
  totalPages: number

  @ApiProperty({
    description: "Budget view with summary data and paginated transactions",
    type: BudgetView
  })
  data: BudgetView
}
