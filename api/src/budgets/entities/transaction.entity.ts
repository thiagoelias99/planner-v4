import { AvailableIcons } from "../../utils/icons"
import { EPaymentMethod } from "./payment-method.enum"
import { ETransactionCategoryType } from "./transaction-category.entity"
import { ETransactionFrequency } from "./transaction-frequency.enum"
import { BudgetTransactionItem, iTransactionItem } from "./transaction-item.entity"

export interface iTransaction {
  id: string
  userId: string
  description: string
  referenceValue: number
  paymentMethod: EPaymentMethod
  categoryId: string
  categoryDescription: string
  type: ETransactionCategoryType
  freq: ETransactionFrequency
  interval?: number
  count?: number
  startDate: Date
  until?: Date
  byDay?: number
  byMonthDay?: number
  byMonth?: number
  active: boolean
  imageUrl?: string
  categoryIcon?: AvailableIcons
  items?: iTransactionItem[]
}

export class Transaction {
  id: string
  userId: string
  description: string
  referenceValue: number
  paymentMethod: EPaymentMethod
  categoryId: string
  categoryDescription: string
  type: ETransactionCategoryType
  freq: ETransactionFrequency
  interval?: number
  count?: number
  startDate: Date
  until?: Date
  byDay?: number
  byMonthDay?: number
  byMonth?: number
  active: boolean
  items?: BudgetTransactionItem[]
  imageUrl?: string
  categoryIcon?: AvailableIcons

  constructor(data: iTransaction) {
    Object.assign(this, data)

    this.startDate = new Date(data.startDate)
    this.until = data.until ? new Date(data.until) : undefined
    this.active = Boolean(data.active)
    this.items = data.items?.map(item => new BudgetTransactionItem(item))
  }
}