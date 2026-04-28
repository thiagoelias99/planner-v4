import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from "@nestjs/common"
import { BudgetsService } from "./budgets.service"
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { CreateBudgetCategoryInput } from "./dto/create-category.input"
import { TransactionCategoryView } from "./dto/transaction-category.view"
import { UpdateBudgetCategoryInput } from "./dto/update-category.input"
import { CreateBudgetTransactionInput } from "./dto/create-transaction.input"
import { TransactionView } from "./dto/transaction.view"
import { BudgetView } from "./dto/budget.view"
import { isAfter } from "date-fns"
import { QueryBudgetInput } from "./dto/query-budget.input"
import { CreateTransactionFormInput } from "./dto/create-transaction-form.input"
import { UpdateBudgetTransactionItemInput } from "./dto/update-transaction-item.input"
import { TransactionItemView } from "./dto/transaction-item.view"
import { UpdateBudgetTransactionInput } from "./dto/update-transaction.input"
import { TransactionCategoryTableView } from "./dto/category-table.view"
import { Session, type UserSession } from "@thallesp/nestjs-better-auth"

@ApiTags("Budgets Module")
@Controller("budgets")
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) { }

  @Get("/")
  @ApiOperation({ summary: "Get budget for specific date range" })
  @ApiResponse({
    status: 200,
    description: "OK",
    type: BudgetView,
  })
  async getBudget(
    @Session() session: UserSession,
    @Query() query: QueryBudgetInput,
  ) {
    const userId = session.user.id as string
    const { from, to } = query

    //Validation
    if (isAfter(from, to)) {
      throw new BadRequestException("From date must be before to date")
    }
    return await this.budgetsService.getBudgetBetweenDates({ userId, from, to })
  }

  @Post("/categories")
  @HttpCode(201)
  @ApiOperation({ summary: "Create a new category" })
  @ApiBody({ type: CreateBudgetCategoryInput })
  @ApiResponse({
    status: 201,
    description: "Created",
    type: TransactionCategoryView,
  })
  async createCategory(
    @Session() session: UserSession,
    @Body() body: CreateBudgetCategoryInput
  ) {
    const userId = session.user.id as string
    const category = await this.budgetsService.createCategory(body, userId)
    return new TransactionCategoryView(category)
  }

  @Get("/categories")
  @ApiOperation({ summary: "Get all user categories" })
  @ApiResponse({
    status: 200,
    description: "OK",
    type: [TransactionCategoryView],
  })
  async findAllCategories(
    @Session() session: UserSession,
  ) {
    const userId = session.user.id as string
    const categories = await this.budgetsService.getCategories(userId)
    return categories.map((category) => new TransactionCategoryView(category))
  }

  @Get("/categories/table")
  @ApiOperation({ summary: "Get all user categories summary table data" })
  @ApiResponse({
    status: 200,
    description: "OK",
    type: TransactionCategoryTableView,
  })
  async findAllCategoriesWithSummary(
    @Session() session: UserSession,
  ) {
    const userId = session.user.id as string
    return this.budgetsService.getCategoryTableView(userId)
  }

  @Get("/categories/:id")
  @ApiOperation({ summary: "Get a category by id" })
  @ApiResponse({
    status: 200,
    description: "OK",
    type: TransactionCategoryView,
  })
  async findCategory(
    @Session() session: UserSession,
    @Param("id") id: string
  ) {
    const userId = session.user.id as string
    const category = await this.budgetsService.getCategory(id, userId)
    return new TransactionCategoryView(category)
  }

  @Patch("/categories/:id")
  @ApiOperation({ summary: "Update a category" })
  @ApiBody({ type: UpdateBudgetCategoryInput })
  @ApiResponse({
    status: 200,
    description: "OK",
    type: TransactionCategoryView,
  })
  async updateCategory(
    @Session() session: UserSession,
    @Body() body: UpdateBudgetCategoryInput,
    @Param("id") id: string
  ) {
    const userId = session.user.id as string
    const category = await this.budgetsService.updateCategory(body, id, userId)
    return new TransactionCategoryView(category)
  }

  @Delete("/categories/:id")
  @ApiOperation({ summary: "Remove a category" })
  @ApiResponse({
    status: 204,
    description: "No Content",
  })
  async removeCategory(
    @Session() session: UserSession,
    @Param("id") id: string
  ) {
    const userId = session.user.id as string
    await this.budgetsService.remove(userId, id)
  }

  @Post("/transactions")
  @HttpCode(201)
  @ApiOperation({ summary: "Create a new transaction" })
  @ApiResponse({
    status: 201,
    description: "Created",
    type: TransactionView,
  })
  async createTransaction(
    @Session() session: UserSession,
    @Body() body: CreateBudgetTransactionInput
  ) {
    const userId = session.user.id as string
    const transaction = await this.budgetsService.createTransaction(body, userId)
    return new TransactionView(transaction)
  }

  @Get("/transactions")
  @ApiOperation({ summary: "Get all user transactions" })
  @ApiResponse({
    status: 200,
    description: "OK",
    type: [TransactionView],
  })
  async findAllTransactions(
    @Session() session: UserSession,
  ) {
    const userId = session.user.id as string
    const transactions = await this.budgetsService.getTransactions(userId)
    return transactions.map((transaction) => new TransactionView(transaction))
  }

  @Get("/transactions/:id")
  @ApiOperation({ summary: "Get transaction with items" })
  @ApiResponse({
    status: 200,
    description: "OK",
    type: [TransactionView],
  })
  async findTransaction(
    @Session() session: UserSession,
    @Param("id") id: string
  ) {
    const userId = session.user.id as string
    const transaction = await this.budgetsService.getTransaction(id, userId)
    return new TransactionView(transaction)
  }

  @Patch("/transactions/:id")
  @ApiOperation({ summary: "Update a transaction" })
  @ApiBody({ type: CreateBudgetTransactionInput })
  @ApiResponse({
    status: 200,
    description: "OK",
    type: TransactionView,
  })
  async updateTransaction(
    @Session() session: UserSession,
    @Body() body: UpdateBudgetTransactionInput,
    @Param("id") id: string
  ) {
    const userId = session.user.id as string
    const transaction = await this.budgetsService.updateTransaction(body, id, userId)
    return new TransactionView(transaction)
  }

  @Post("/transactions/form-input")
  @HttpCode(201)
  @ApiOperation({ summary: "Create a new transaction from form input" })
  @ApiResponse({
    status: 201,
    description: "Created",
    type: BudgetView,
  })
  async createTransactionFromFormInput(
    @Session() session: UserSession,
    @Body() body: CreateTransactionFormInput
  ) {
    const { from, to } = body

    //Validation
    if (isAfter(from!, to!)) {
      throw new BadRequestException("From date must be before to date")
    }
    const userId = session.user.id as string

    console.log("body", body)

    return this.budgetsService.createTransactionFromForm(body, userId)
  }

  @Patch("/transaction-items/:id")
  @ApiOperation({ summary: "Update a transaction item" })
  @ApiBody({ type: UpdateBudgetTransactionItemInput })
  @ApiResponse({
    status: 200,
    description: "OK",
    type: TransactionItemView,
  })
  async updateTransactionItem(
    @Session() session: UserSession,
    @Body() body: UpdateBudgetTransactionItemInput,
    @Param("id") id: string
  ) {
    const userId = session.user.id as string
    const transaction = await this.budgetsService.updateTransactionItem(body, id, userId)
    return new TransactionItemView(transaction)
  }

  @Delete("/transaction-items/:id")
  @ApiOperation({ summary: "Remove a transaction item" })
  @ApiResponse({
    status: 204,
    description: "No Content",
  })
  async removeTransactionItem(
    @Session() session: UserSession,
    @Param("id") id: string
  ) {
    const userId = session.user.id as string
    await this.budgetsService.removeTransactionItem(id, userId)
  }
}