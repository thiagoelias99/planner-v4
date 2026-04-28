/* eslint-disable indent */
import { ApiProperty } from "@nestjs/swagger"
import { EPaymentMethod } from "../entities/payment-method.enum"
import { ETransactionCategoryType, TransactionCategory } from "../entities/transaction-category.entity"
import { BudgetTransactionItem } from "../entities/transaction-item.entity"
import { TransactionCategoryView } from "./transaction-category.view"
import { TransactionItemView } from "./transaction-item.view"

class BudgetIncomeView {
  @ApiProperty()
  amount: number
}

class BudgetExpenseView {
  @ApiProperty()
  amount: number

  @ApiProperty()
  percentage: number
}

class BudgetInvestmentView {
  @ApiProperty()
  amount: number

  @ApiProperty()
  percentage: number
}

class BudgetCreditCardView {
  @ApiProperty()
  amount: number

  @ApiProperty()
  alreadyPaid: number
}

export class BudgetView {

  @ApiProperty()
  from: Date

  @ApiProperty()
  to: Date

  @ApiProperty()
  balance: number

  @ApiProperty()
  predictedBalance: number

  @ApiProperty({ type: BudgetIncomeView })
  incomes: BudgetIncomeView

  @ApiProperty({ type: BudgetIncomeView })
  predictedIncomes: BudgetIncomeView

  @ApiProperty({ type: BudgetIncomeView })
  redemptions: BudgetIncomeView

  @ApiProperty({ type: BudgetIncomeView })
  predictedRedemptions: BudgetIncomeView

  @ApiProperty({ type: BudgetExpenseView })
  expenses: BudgetExpenseView

  @ApiProperty({ type: BudgetExpenseView })
  predictedExpenses: BudgetExpenseView

  @ApiProperty({ type: BudgetInvestmentView })
  investments: BudgetInvestmentView

  @ApiProperty({ type: BudgetInvestmentView })
  predictedInvestments: BudgetInvestmentView

  @ApiProperty({ type: BudgetCreditCardView })
  creditCard: BudgetCreditCardView

  @ApiProperty({ type: BudgetCreditCardView })
  predictedCreditCard: BudgetCreditCardView

  @ApiProperty({ type: [TransactionItemView] })
  transactions: TransactionItemView[]

  @ApiProperty({ type: [TransactionCategoryView] })
  categories: TransactionCategoryView[]

  constructor(data: {
    transactions: BudgetTransactionItem[],
    categories: TransactionCategory[],
    from: Date,
    to: Date,
  }) {
    const activeTransactions = data.transactions.filter(t => t.active)

    const totalIncomesAmount = this.calculateTotalIncomeAmount(activeTransactions)
    const totalPredictedIncomesAmount = this.calculateTotalIncomeAmount(data.transactions)
    const totalRedemptionsAmount = this.calculateTotalRedemptionAmount(activeTransactions)
    const totalPredictedRedemptionsAmount = this.calculateTotalRedemptionAmount(data.transactions)
    const totalExpensesAmount = this.calculateTotalExpensesAmount(activeTransactions)
    const totalPredictedExpensesAmount = this.calculateTotalExpensesAmount(data.transactions)
    const totalInvestmentsAmount = this.calculateTotalInvestmentsAmount(activeTransactions)
    const totalPredictedInvestmentsAmount = this.calculateTotalInvestmentsAmount(data.transactions)
    const totalCreditCardAmount = this.calculateTotalCreditCardAmount(activeTransactions)
    const totalPredictedCreditCardAmount = this.calculateTotalCreditCardAmount(data.transactions)
    const totalAlreadyPaidCreditCardAmount = this.calculateAlreadyPaidCreditCardsAmount(activeTransactions)
    const totalPredictedAlreadyPaidCreditCardAmount = this.calculateAlreadyPaidCreditCardsAmount(data.transactions)
    const currentBalance = totalIncomesAmount + totalRedemptionsAmount - totalExpensesAmount - totalInvestmentsAmount
    const predictedBalance = totalPredictedIncomesAmount + totalPredictedRedemptionsAmount - totalPredictedExpensesAmount - totalPredictedInvestmentsAmount

    this.from = new Date(data.from)
    this.to = new Date(data.to)
    this.balance = currentBalance
    this.predictedBalance = predictedBalance
    this.incomes = { amount: totalIncomesAmount }
    this.predictedIncomes = { amount: totalPredictedIncomesAmount }
    this.redemptions = { amount: totalRedemptionsAmount }
    this.predictedRedemptions = { amount: totalPredictedRedemptionsAmount }
    this.expenses = { amount: totalExpensesAmount, percentage: this.calculatePercentage(totalExpensesAmount, totalIncomesAmount + totalRedemptionsAmount) }
    this.predictedExpenses = { amount: totalPredictedExpensesAmount, percentage: this.calculatePercentage(totalPredictedExpensesAmount, totalPredictedIncomesAmount + totalPredictedRedemptionsAmount) }
    this.investments = { amount: totalInvestmentsAmount, percentage: this.calculatePercentage(totalInvestmentsAmount, totalIncomesAmount + totalRedemptionsAmount) }
    this.predictedInvestments = { amount: totalPredictedInvestmentsAmount, percentage: this.calculatePercentage(totalPredictedInvestmentsAmount, totalPredictedIncomesAmount + totalPredictedRedemptionsAmount) }
    this.creditCard = { amount: totalCreditCardAmount, alreadyPaid: totalAlreadyPaidCreditCardAmount }
    this.predictedCreditCard = { amount: totalPredictedCreditCardAmount, alreadyPaid: totalPredictedAlreadyPaidCreditCardAmount }
    this.transactions = data.transactions.map(t => new TransactionItemView(t))
    this.categories = data.categories.map(category => {
      const [amount, percentage] = this.calculateAmountAndPercentageForCategories(
        category,
        data.transactions,
        totalExpensesAmount,
        totalCreditCardAmount,
        totalAlreadyPaidCreditCardAmount
      )
      return new TransactionCategoryView(category, amount, percentage)
    })
  }

  flatten(): string {
    return JSON.stringify(this)
  }

  private calculateTotalIncomeAmount(transactions: BudgetTransactionItem[]): number {
    return transactions
      .filter(t => t.type === ETransactionCategoryType.INCOME)
      .reduce((acc, t) => acc + t.value, 0)
  }

  private calculateTotalRedemptionAmount(transactions: BudgetTransactionItem[]): number {
    return transactions
      .filter(t => t.type === ETransactionCategoryType.REDEMPTION)
      .reduce((acc, t) => acc + t.value, 0)
  }

  private calculateTotalExpensesAmount(transactions: BudgetTransactionItem[]): number {
    return transactions
      .filter(t => ((t.type === ETransactionCategoryType.EXPENSE || t.type === ETransactionCategoryType.CREDIT_CARD_BILL) && t.paymentMethod !== EPaymentMethod.CREDIT))
      .reduce((acc, t) => acc + t.value, 0)
  }

  private calculateTotalInvestmentsAmount(transactions: BudgetTransactionItem[]): number {
    return transactions
      .filter(t => (t.type === ETransactionCategoryType.INVESTMENT))
      .reduce((acc, t) => acc + t.value, 0)
  }

  private calculateTotalCreditCardAmount(transactions: BudgetTransactionItem[]): number {
    return transactions
      .filter(t => (t.paymentMethod === EPaymentMethod.CREDIT && t.type === ETransactionCategoryType.EXPENSE))
      .reduce((acc, t) => acc + t.value, 0)
  }

  private calculateAlreadyPaidCreditCardsAmount(transactions: BudgetTransactionItem[]): number {
    return transactions
      .filter(t => (t.type === ETransactionCategoryType.CREDIT_CARD_BILL))
      .reduce((acc, t) => acc + t.value, 0)
  }

  private calculatePercentage(amount: number, totalAmount: number): number {
    return totalAmount > 0 ? (amount / totalAmount) * 100 : 0
  }

  private calculateAmountAndPercentageForCategories(
    category: TransactionCategory,
    transactions: BudgetTransactionItem[],
    totalExpensesAmount: number,
    totalCreditCardAmount: number,
    totalAlreadyPaidCreditCardAmount: number
  ): [number, number] {
    const amount = transactions
      // .filter(t => (t.categorySlug === category.slug && t.type === ETransactionCategoryType.EXPENSE))
      .filter(t => (t.categorySlug === category.slug))
      .reduce((acc, t) => acc + t.value, 0)

    const percentage = (totalExpensesAmount - totalAlreadyPaidCreditCardAmount + totalCreditCardAmount) > 0 ? (amount / (totalExpensesAmount - totalAlreadyPaidCreditCardAmount + totalCreditCardAmount)) * 100 : 0

    // Percentage only for expenses
    return [amount, category.type === ETransactionCategoryType.EXPENSE ? percentage : 0]
  }
}
