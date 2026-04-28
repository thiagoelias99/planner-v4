/* eslint-disable indent */
import { ApiProperty } from "@nestjs/swagger"
import { ETransactionCategoryType, TransactionCategory } from "../entities/transaction-category.entity"
import { Transaction } from "../entities/transaction.entity"
import { TransactionView } from "./transaction.view"

export class TransactionCategoryView {
  constructor(category: TransactionCategory, amount?: number, percentage?: number) {
    this.id = category.id
    this.description = category.description
    this.slug = category.slug
    this.type = category.type
    this.icon = category.icon
    this.color = category.color
    this.amount = amount
    this.percentage = percentage
    this.transactions = category.transactions?.map(t => new Transaction(t))
  }

  @ApiProperty()
  id: string

  @ApiProperty()
  description: string

  @ApiProperty()
  slug: string

  @ApiProperty()
  type: ETransactionCategoryType

  @ApiProperty({ required: false })
  icon?: string

  @ApiProperty({ required: false })
  color?: string

  @ApiProperty({ required: false })
  amount?: number

  @ApiProperty({ required: false })
  percentage?: number

  @ApiProperty({ required: false, type: [TransactionView] })
  transactions?: TransactionView[]
}