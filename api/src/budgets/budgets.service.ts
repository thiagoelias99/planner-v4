import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { BudgetsRepository } from "./budgets.repository"
import { CreateBudgetCategoryInput } from "./dto/create-category.input"
import { ETransactionCategoryType, TransactionCategory } from "./entities/transaction-category.entity"
import { randomUUID } from "crypto"
import slugify from "slugify"
import { UpdateBudgetCategoryInput } from "./dto/update-category.input"
import { CreateBudgetTransactionInput } from "./dto/create-transaction.input"
import { Transaction } from "./entities/transaction.entity"
import { UpdateBudgetTransactionInput } from "./dto/update-transaction.input"
import { CreateBudgetTransactionItemInput } from "./dto/create-transaction-item.input"
import { BudgetTransactionItem } from "./entities/transaction-item.entity"
import { UpdateBudgetTransactionItemInput } from "./dto/update-transaction-item.input"
import { QueryTransactionInput } from "./dto/query-transaction.input"
import { BudgetView } from "./dto/budget.view"
import { addHours, addMonths, endOfMonth, setHours, startOfMonth, subMonths } from "date-fns"
import { CreateTransactionFormInput } from "./dto/create-transaction-form.input"
import { TransactionCategoryTableView } from "./dto/category-table.view"
import { ETransactionFrequency } from "./entities/transaction-frequency.enum"
import { createId } from "@paralleldrive/cuid2"
import { EPaymentMethod } from "./entities/payment-method.enum"


@Injectable()
export class BudgetsService {
  constructor(
    private readonly budgetsRepository: BudgetsRepository,
  ) { }

  // Categories
  async createCategory(data: CreateBudgetCategoryInput, userId: string): Promise<TransactionCategory> {
    const slug = slugify(data.description, { lower: true, strict: true })
    const id = data.id || createId()

    return this.budgetsRepository.createCategory({ ...data, id }, userId, slug)
  }

  async getCategories(userId: string): Promise<TransactionCategory[]> {
    return this.budgetsRepository.getCategories(userId)
  }

  async getCategory(categoryId: string, userId: string): Promise<TransactionCategory> {
    const category = await this.budgetsRepository.getCategory({ categoryId, userId })
    return category
  }

  async updateCategory(data: UpdateBudgetCategoryInput, categoryId: string, userId: string): Promise<TransactionCategory> {
    const slug = data.description ? slugify(data.description, { lower: true, strict: true }) : undefined

    return this.budgetsRepository.updateCategory({ ...data }, categoryId, userId, slug)
  }

  async remove(userId: string, categoryId: string): Promise<void> {
    return this.budgetsRepository.removeCategory(userId, categoryId)
  }

  // Transactions
  async createTransaction(data: CreateBudgetTransactionInput, userId: string): Promise<Transaction> {
    const id = data.id || createId()
    return this.budgetsRepository.createTransaction({ ...data, id }, userId)
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    return this.budgetsRepository.getTransactions(userId)
  }

  async getTransaction(transactionId: string, userId: string): Promise<Transaction> {
    return this.budgetsRepository.getTransaction(transactionId, userId)
  }

  async updateTransaction(data: UpdateBudgetTransactionInput, transactionId: string, userId: string): Promise<Transaction> {
    return this.budgetsRepository.updateTransaction(data, transactionId, userId)
  }

  async removeTransaction(userId: string, transactionId: string): Promise<void> {
    return this.budgetsRepository.removeTransaction(userId, transactionId)
  }

  // Transaction - Items
  async createTransactionItem(data: CreateBudgetTransactionItemInput, userId: string): Promise<BudgetTransactionItem> {
    const id = data.id || createId()

    return this.budgetsRepository.createTransactionItem({ ...data, id }, userId)
  }

  async getTransactionItems(transactionId: string, userId: string): Promise<BudgetTransactionItem[]> {
    return this.budgetsRepository.getTransactionItems(transactionId, userId)
  }

  async getAllTransactionItems(userId: string, query?: QueryTransactionInput): Promise<BudgetTransactionItem[]> {
    return this.budgetsRepository.getAllTransactionItems(userId, query)
  }

  async updateTransactionItem(data: UpdateBudgetTransactionItemInput, id: string, userId: string): Promise<BudgetTransactionItem> {
    return this.budgetsRepository.updateTransactionItem(data, id, userId)
  }

  async removeTransactionItem(transactionItemId: string, userId: string): Promise<void> {
    return this.budgetsRepository.removeTransactionItem(transactionItemId, userId)
  }

  async getBudgetBetweenDates(data: { from: Date, to: Date, userId: string }): Promise<BudgetView> {
    const transactions = await this.getAllTransactionItems(data.userId, { startDate: data.from, endDate: data.to })
    const categories = await this.getCategories(data.userId)

    return new BudgetView({ transactions, categories, from: data.from, to: data.to })
  }

  async createTransactionFromForm(data: CreateTransactionFormInput, userId: string): Promise<BudgetView> {
    const from = data.from || startOfMonth(data.startDate)
    const to = data.to || endOfMonth(data.startDate)
    await this.budgetsRepository.createTransactionFromForm(data, userId)
    return this.getBudgetBetweenDates({ from, to, userId })
  }

  async getCategoryTableView(userId: string): Promise<TransactionCategoryTableView> {
    const data = await this.budgetsRepository.getCategoriesWithAllItems(userId)
    return new TransactionCategoryTableView(data)
  }

  async getOrCreateCategoryByDescription(userId: string, input: CreateBudgetCategoryInput): Promise<TransactionCategory> {
    const id = input.id || createId()

    return this.budgetsRepository.getOrCreateCategoryByDescription(userId, {
      ...input, id
    })
  }

  async getOrCreateTransactionByDescription(userId: string, input: CreateBudgetTransactionInput): Promise<Transaction> {
    const id = input.id || createId()

    return this.budgetsRepository.getOrCreateTransactionByDescription(userId, { ...input, id })
  }

  async createMissingMonthlyTransactionItemsForCurrentMonth(userId: string) {
    const currentDate = new Date()
    const currentMonthStart = startOfMonth(currentDate)
    const currentMonthEnd = endOfMonth(currentDate)
    // Mês anterior
    const startDate = startOfMonth(subMonths(currentDate, 1))
    const endDate = endOfMonth(subMonths(currentDate, 1))

    // Criar repasse entre os meses
    const lastMonthBalanceDefaultCategory: CreateBudgetCategoryInput = {
      description: "Transferencia próximo mês",
      type: ETransactionCategoryType.INVESTMENT
    }

    const nextMonthBalanceDefaultCategory: CreateBudgetCategoryInput = {
      description: "Saldo mês anterior",
      type: ETransactionCategoryType.REDEMPTION
    }

    const lastMonthBalanceDefaultTransaction: CreateBudgetTransactionInput = {
      description: "Transferência próximo mês",
      referenceValue: 0,
      paymentMethod: EPaymentMethod.TRANSFER,
      categoryId: "",
      freq: ETransactionFrequency.CASUAL,
      startDate
    }

    const nextMonthBalanceDefaultTransaction: CreateBudgetTransactionInput = {
      description: "Saldo mês anterior",
      referenceValue: 0,
      paymentMethod: EPaymentMethod.TRANSFER,
      categoryId: "",
      freq: ETransactionFrequency.CASUAL,
      startDate
    }

    // Orçamento do mês anterior
    const previousMonthBudget = await this.getBudgetBetweenDates({
      from: startDate,
      to: endDate,
      userId,
    })

    // Verificar balanço do mês anterior e criar as transações de repasse para o próximo mês
    if (previousMonthBudget.balance === 0) {
      // Balance is 0, do not create a transaction
    } else {
      // Get the user category for the last month balance
      const lastMonthCategory = await this.getOrCreateCategoryByDescription(userId, lastMonthBalanceDefaultCategory)
      if (!lastMonthCategory) throw new InternalServerErrorException("Error creating last month category")

      // Get the user transaction for the last month balance
      const lastMonthTransaction = await this.getOrCreateTransactionByDescription(userId, {
        ...lastMonthBalanceDefaultTransaction,
        categoryId: lastMonthCategory.id,
      })
      if (!lastMonthTransaction) throw new InternalServerErrorException("Error creating last month transaction")

      // Get the user category for the next month balance
      const nextMonthCategory = await this.getOrCreateCategoryByDescription(userId, nextMonthBalanceDefaultCategory)
      if (!nextMonthCategory) throw new InternalServerErrorException("Error creating next month category")

      // Get the user transaction for the next month balance
      const nextMonthTransaction = await this.getOrCreateTransactionByDescription(userId, {
        ...nextMonthBalanceDefaultTransaction,
        categoryId: nextMonthCategory.id,
      })
      if (!nextMonthTransaction) throw new InternalServerErrorException("Error creating next month transaction")

      // Create the transaction item for the last month balance
      const lastMonthTransactionItem = await this.createTransactionItem(
        {
          date: setHours(endDate, 22),
          transactionId: lastMonthTransaction.id,
          value: previousMonthBudget.balance,
          paymentMethod: EPaymentMethod.TRANSFER,
        },
        userId
      )
      if (!lastMonthTransactionItem) throw new InternalServerErrorException("Error creating last month transaction item")

      // Create the transaction item for the next month balance
      const nextMonthTransactionItem = await this.createTransactionItem(
        {
          date: setHours(addMonths(startDate, 1), 6),
          transactionId: nextMonthTransaction.id,
          value: previousMonthBudget.balance,
          paymentMethod: EPaymentMethod.TRANSFER,
        },
        userId
      )
      if (!nextMonthTransactionItem) throw new InternalServerErrorException("Error creating next month transaction item")
    }

    // Get all monthly transactions that should be active in the current month
    const monthlyTransactions = (await this.getTransactions(userId)).filter(
      transaction =>
        transaction.freq === ETransactionFrequency.MONTHLY &&
        transaction.startDate <= currentMonthEnd &&
        (!transaction.until || transaction.until >= currentMonthStart)
    )

    // Get all transaction items for the current month
    const currentMonthTransactions = await this.getAllTransactionItems(userId, {
      startDate: currentMonthStart,
      endDate: currentMonthEnd
    })

    // Find missing monthly transactions
    const missingMonthlyTransactions = monthlyTransactions.filter(monthlyTransaction => {
      const hasTransactionItem = currentMonthTransactions.some(item => item.transactionId === monthlyTransaction.id)
      return !hasTransactionItem
    })

    // Create missing monthly transaction items for the current month
    for (const monthlyTransaction of missingMonthlyTransactions) {
      const transactionDate = addHours(new Date(currentDate.getFullYear(), currentDate.getMonth(), monthlyTransaction.byMonthDay), 12)

      // Only create if the date is valid and falls within the current month
      if (transactionDate >= currentMonthStart && transactionDate <= currentMonthEnd) {
        await this.createTransactionItem({
          date: transactionDate,
          transactionId: monthlyTransaction.id,
          value: monthlyTransaction.referenceValue,
          paymentMethod: monthlyTransaction.paymentMethod,
          active: false
        }, userId)
      }
    }
  }
}
