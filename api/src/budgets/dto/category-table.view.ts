/* eslint-disable indent */
import { format } from "date-fns"
import { ETransactionCategoryType, TransactionCategory } from "../entities/transaction-category.entity"
import { BudgetTransactionItem } from "../entities/transaction-item.entity"
import { ApiProperty } from "@nestjs/swagger"

export class TransactionCategoryTableColumn {
  constructor(month: string, category: TransactionCategory) {
    this.month = month
    const monthTransactionItems: BudgetTransactionItem[] = []
    category.transactions?.forEach(transaction =>
      transaction.items?.forEach(item => {
        const yearMonth = format(item.date, "yy-MM")
        if (yearMonth === month) {
          monthTransactionItems.push(item)
        }
      })
    )

    this.amount = monthTransactionItems.reduce((acc, item) => {
      return acc + item.value
    }, 0)
  }

  @ApiProperty()
  month: string

  @ApiProperty()
  amount: number
}

export class TransactionCategoryTableRow {
  constructor(category: string, categories: TransactionCategory[], headers: string[]) {
    const categoryData = categories.find(cat => cat.description === category)
    if (!categoryData) {
      throw new Error(`Category ${category} not found`)
    }

    this.id = categoryData.id
    this.description = categoryData.description
    this.slug = categoryData.slug
    this.type = categoryData.type
    this.icon = categoryData.icon
    this.color = categoryData.color
    this.columns = headers.map(month => {
      const column = new TransactionCategoryTableColumn(month, categoryData)
      return column
    })
  }

  @ApiProperty()
  id: string

  @ApiProperty()
  description: string

  @ApiProperty()
  slug: string

  @ApiProperty({ enum: ETransactionCategoryType })
  type: ETransactionCategoryType

  @ApiProperty({ required: false })
  icon?: string

  @ApiProperty({ required: false })
  color?: string

  @ApiProperty({ type: [TransactionCategoryTableColumn] })
  columns: TransactionCategoryTableColumn[]
}

export class TransactionCategoryTableView {
  constructor(categories: TransactionCategory[]) {

    const allMonths: string[] = this.getHeaderForAllMonths(categories)
    this.headers = allMonths

    this.rows = categories.map(category => {
      const row = new TransactionCategoryTableRow(category.description, categories, allMonths)
      return row
    })
  }

  @ApiProperty({ type: [String] })
  headers: string[] = []

  @ApiProperty({ type: [TransactionCategoryTableRow] })
  rows: TransactionCategoryTableRow[]

  private getHeaderForAllMonths(categories: TransactionCategory[]): string[] {
    const allMonths: Set<string> = new Set()

    categories.forEach(category => {
      category.transactions?.forEach(transaction => {
        transaction.items?.forEach(item => {
          const yearMonth = format(item.date, "yy-MM")
          allMonths.add(yearMonth)
        })
      })
    })

    return Array.from(allMonths).sort((a, b) => {
      return b.localeCompare(a)
    })
  }
}