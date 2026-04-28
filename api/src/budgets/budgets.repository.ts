import { CreateBudgetCategoryInput } from "./dto/create-category.input"
import { CreateTransactionFormInput } from "./dto/create-transaction-form.input"
import { CreateBudgetTransactionItemInput } from "./dto/create-transaction-item.input"
import { CreateBudgetTransactionInput } from "./dto/create-transaction.input"
import { QueryTransactionInput } from "./dto/query-transaction.input"
import { UpdateBudgetCategoryInput } from "./dto/update-category.input"
import { UpdateBudgetTransactionItemInput } from "./dto/update-transaction-item.input"
import { UpdateBudgetTransactionInput } from "./dto/update-transaction.input"
import { TransactionCategory } from "./entities/transaction-category.entity"
import { BudgetTransactionItem } from "./entities/transaction-item.entity"
import { Transaction } from "./entities/transaction.entity"

export abstract class BudgetsRepository {
  // Categories
  abstract createCategory(data: CreateBudgetCategoryInput, userId: string, slug: string): Promise<TransactionCategory>
  abstract getCategories(userId: string): Promise<TransactionCategory[]>
  abstract getCategoriesWithAllItems(userId: string): Promise<TransactionCategory[]>
  abstract getCategory(data: { categoryId: string, userId: string }): Promise<TransactionCategory>
  abstract updateCategory(data: UpdateBudgetCategoryInput, categoryId: string, userId: string, slug?: string): Promise<TransactionCategory>
  abstract removeCategory(userId: string, categoryId: string): Promise<void>
  abstract getOrCreateCategoryByDescription(userId: string, input: CreateBudgetCategoryInput): Promise<TransactionCategory>

  // Transactions
  abstract createTransaction(data: CreateBudgetTransactionInput, userId: string): Promise<Transaction>
  abstract getTransactions(userId: string): Promise<Transaction[]>
  abstract getTransaction(transactionId: string, userId: string): Promise<Transaction>
  abstract updateTransaction(data: UpdateBudgetTransactionInput, id: string, userId: string): Promise<Transaction>
  abstract removeTransaction(userId: string, transactionId: string): Promise<void>
  abstract getOrCreateTransactionByDescription(userId: string, input: CreateBudgetTransactionInput): Promise<Transaction>

  // Transaction Items
  abstract createTransactionItem(data: CreateBudgetTransactionItemInput, userId: string): Promise<BudgetTransactionItem>
  abstract updateTransactionItem(data: UpdateBudgetTransactionItemInput, id: string, userId: string): Promise<BudgetTransactionItem>
  abstract getTransactionItems(transactionId: string, userId: string): Promise<BudgetTransactionItem[]>
  abstract getAllTransactionItems(userId: string, query?: QueryTransactionInput): Promise<BudgetTransactionItem[]>
  abstract removeTransactionItem(transactionItemId: string, userId: string): Promise<void>

  // Forms
  abstract createTransactionFromForm(data: CreateTransactionFormInput, userId: string): Promise<void>
}