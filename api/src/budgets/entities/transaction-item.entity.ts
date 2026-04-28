import { AvailableIcons } from "../../utils/icons"
import { EPaymentMethod } from "./payment-method.enum"
import { ETransactionCategoryType } from "./transaction-category.entity"
import { ETransactionFrequency } from "./transaction-frequency.enum"

export interface iTransactionItem {
  id: string
  transactionId: string
  date: Date
  value: number
  paymentMethod: EPaymentMethod
  description: string
  categoryId: string
  categoryDescription: string
  categorySlug: string
  type: ETransactionCategoryType
  freq: ETransactionFrequency
  byDay?: number
  byMonthDay?: number
  byMonth?: number
  imageUrl?: string
  categoryIcon?: AvailableIcons
  active: boolean
}

export class BudgetTransactionItem {
  id: string
  transactionId: string
  description: string
  categoryId: string
  categoryDescription: string
  categorySlug: string
  type: ETransactionCategoryType
  paymentMethod: EPaymentMethod
  date: Date
  value: number
  freq: ETransactionFrequency
  byDay?: number
  byMonthDay?: number
  byMonth?: number
  imageUrl?: string
  categoryIcon?: AvailableIcons
  active: boolean

  constructor(data: iTransactionItem) {
    Object.assign(this, data)
    this.date = new Date(data.date)
  }
}