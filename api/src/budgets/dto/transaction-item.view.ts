/* eslint-disable indent */
import { ApiProperty } from "@nestjs/swagger"
import { BudgetTransactionItem } from "../entities/transaction-item.entity"
import { EPaymentMethod } from "../entities/payment-method.enum"
import { ETransactionCategoryType } from "../entities/transaction-category.entity"
import { ETransactionFrequency } from "../entities/transaction-frequency.enum"
import { AvailableIcons } from "../../utils/icons"

export class TransactionItemView {
  constructor(data: BudgetTransactionItem) {
    this.id = data.id
    this.transactionId = data.transactionId
    this.description = data.description
    this.date = data.date
    this.value = data.value
    this.paymentMethod = data.paymentMethod
    this.categoryId = data.categoryId
    this.categoryDescription = data.categoryDescription
    this.categorySlug = data.categorySlug
    this.type = data.type
    this.freq = data.freq
    this.byDay = data.byDay
    this.byMonthDay = data.byMonthDay
    this.byMonth = data.byMonth
    this.imageUrl = data.imageUrl
    this.categoryIcon = data.categoryIcon
    this.active = data.active
  }

  @ApiProperty()
  id: string

  @ApiProperty()
  transactionId: string

  @ApiProperty()
  description: string

  @ApiProperty()
  date: Date

  @ApiProperty()
  value: number

  @ApiProperty({ enum: EPaymentMethod })
  paymentMethod: EPaymentMethod

  @ApiProperty()
  categoryId: string

  @ApiProperty()
  categoryDescription: string

  @ApiProperty()
  categorySlug: string

  @ApiProperty({ enum: ETransactionCategoryType })
  type: ETransactionCategoryType

  @ApiProperty({ enum: ETransactionFrequency })
  freq: ETransactionFrequency

  @ApiProperty()
  byDay?: number

  @ApiProperty()
  byMonthDay?: number

  @ApiProperty()
  byMonth?: number

  @ApiProperty()
  imageUrl?: string

  @ApiProperty()
  categoryIcon?: AvailableIcons

  @ApiProperty()
  active: boolean
}