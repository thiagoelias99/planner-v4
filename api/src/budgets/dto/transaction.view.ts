/* eslint-disable indent */
import { ApiProperty } from "@nestjs/swagger"
import { EPaymentMethod } from "../entities/payment-method.enum"
import { ETransactionFrequency } from "../entities/transaction-frequency.enum"
import { Transaction } from "../entities/transaction.entity"
import { ETransactionCategoryType } from "../entities/transaction-category.entity"
import { TransactionItemView } from "./transaction-item.view"
import { AvailableIcons } from "../../utils/icons"

export class TransactionView {
  constructor(data: Transaction) {
    this.id = data.id
    this.description = data.description
    this.referenceValue = data.referenceValue
    this.paymentMethod = data.paymentMethod
    this.categoryId = data.categoryId
    this.categoryDescription = data.categoryDescription
    this.type = data.type
    this.startDate = data.startDate
    this.active = data.active
    this.freq = data.freq
    this.interval = data.interval
    this.count = data.count
    this.until = data.until
    this.byDay = data.byDay
    this.byMonthDay = data.byMonthDay
    this.byMonth = data.byMonth
    this.imageUrl = data.imageUrl
    this.categoryIcon = data.categoryIcon
    this.items = data.items?.map(item => new TransactionItemView(item))
  }

  @ApiProperty()
  id: string

  @ApiProperty()
  description: string

  @ApiProperty()
  referenceValue: number

  @ApiProperty()
  paymentMethod: EPaymentMethod

  @ApiProperty()
  categoryId: string

  @ApiProperty()
  categoryDescription: string

  @ApiProperty()
  type: ETransactionCategoryType

  @ApiProperty()
  startDate: Date

  @ApiProperty()
  active: boolean

  @ApiProperty({ enum: ETransactionFrequency })
  freq: ETransactionFrequency

  @ApiProperty({ type: Number })
  interval?: number

  @ApiProperty({ type: Number })
  count?: number

  @ApiProperty({ type: Date })
  until?: Date

  @ApiProperty()
  byDay?: number

  @ApiProperty()
  byMonthDay?: number

  @ApiProperty()
  byMonth?: number

  @ApiProperty()
  items?: TransactionItemView[]

  @ApiProperty()
  imageUrl?: string

  @ApiProperty()
  categoryIcon?: AvailableIcons
}

export class TransactionCompactView {
  constructor(data: Transaction) {
    this.transactionId = data.id
    this.description = data.description
    this.referenceValue = data.referenceValue
    this.paymentMethod = data.paymentMethod
  }

  @ApiProperty()
  transactionId: string

  @ApiProperty()
  description: string

  @ApiProperty()
  referenceValue: number

  @ApiProperty()
  paymentMethod: EPaymentMethod
}