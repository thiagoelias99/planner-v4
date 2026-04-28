import { iTransaction, Transaction } from "./transaction.entity"

interface iTransactionCategory {
  id: string
  userId: string
  description: string
  slug: string
  type: ETransactionCategoryType
  icon?: string
  color?: string
  transactions?: iTransaction[]
}

export class TransactionCategory {
  id: string
  userId: string
  description: string
  slug: string
  type: ETransactionCategoryType
  icon?: string
  color?: string
  transactions?: Transaction[]

  constructor(data: iTransactionCategory) {
    Object.assign(this, data)
    this.transactions = data.transactions?.map(transaction => new Transaction(transaction))
  }
}

export enum ETransactionCategoryType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  INVESTMENT = "INVESTMENT",
  CREDIT_CARD_BILL = "CREDIT_CARD_BILL",
  REDEMPTION = "REDEMPTION"
}