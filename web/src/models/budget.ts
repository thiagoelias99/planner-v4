export enum ETransactionCategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  INVESTMENT = 'INVESTMENT',
  CREDIT_CARD_BILL = 'CREDIT_CARD_BILL',
  REDEMPTION = 'REDEMPTION'
}

export enum EPaymentMethod {
  PIX = 'PIX',
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
  MONEY = 'MONEY',
  TRANSFER = 'TRANSFER',
  TED = 'TED',
  BILLET = 'BILLET'
}

export enum ETransactionFrequency {
  CASUAL = 'CASUAL',
  MONTHLY = 'MONTHLY'
}

export interface ITransactionCategory {
  id: string
  userId: string
  description: string
  slug: string
  type: ETransactionCategoryType
  color?: string
  icon?: string
  amount?: number
  percentage?: number
}

export interface ITransactionItem {
  id: string
  transactionId: string
  value: number
  date: Date
  description: string
  paymentMethod: EPaymentMethod
  categoryId: string
  categoryDescription: string
  categorySlug: string
  type: ETransactionCategoryType
  freq: ETransactionFrequency
  byDay?: number
  byMonth?: number
  byMonthDay?: number
  imageUrl?: string
  categoryIcon?: string
  active: boolean
}

interface IBudgetSummaryAmount {
  amount: number
}

interface IBudgetSummaryWithPercentage {
  amount: number
  percentage: number
}

interface IBudgetCreditCard {
  amount: number
  alreadyPaid: number
}

export interface IBudget {
  from: Date
  to: Date
  balance: number
  predictedBalance: number
  incomes: IBudgetSummaryAmount
  predictedIncomes: IBudgetSummaryAmount
  redemptions: IBudgetSummaryAmount
  predictedRedemptions: IBudgetSummaryAmount
  expenses: IBudgetSummaryWithPercentage
  predictedExpenses: IBudgetSummaryWithPercentage
  investments: IBudgetSummaryWithPercentage
  predictedInvestments: IBudgetSummaryWithPercentage
  creditCard: IBudgetCreditCard
  predictedCreditCard: IBudgetCreditCard
  transactions: ITransactionItem[]
  categories: ITransactionCategory[]
}

export interface IPaginatedBudget {
  data: IBudget
  page: number
  limit: number
  total: number
  totalPages: number
}

// Mappers for UI display
export const eTransactionCategoryTypeMapper: Record<ETransactionCategoryType, { label: string, variant: "default" | "secondary" | "destructive" | "outline" }> = {
  [ETransactionCategoryType.INCOME]: { label: "Receita", variant: "default" },
  [ETransactionCategoryType.EXPENSE]: { label: "Despesa", variant: "destructive" },
  [ETransactionCategoryType.INVESTMENT]: { label: "Investimento", variant: "secondary" },
  [ETransactionCategoryType.CREDIT_CARD_BILL]: { label: "Fatura", variant: "outline" },
  [ETransactionCategoryType.REDEMPTION]: { label: "Resgate", variant: "default" },
}

export const ePaymentMethodMapper: Record<EPaymentMethod, string> = {
  [EPaymentMethod.PIX]: "PIX",
  [EPaymentMethod.DEBIT]: "Débito",
  [EPaymentMethod.CREDIT]: "Crédito",
  [EPaymentMethod.MONEY]: "Dinheiro",
  [EPaymentMethod.TRANSFER]: "Transferência",
  [EPaymentMethod.TED]: "TED",
  [EPaymentMethod.BILLET]: "Boleto",
}
