// greeting.tool.ts
import { Injectable } from "@nestjs/common"
import { Resource, Tool } from "@rekog/mcp-nest"
import { BudgetsService } from "./budgets.service"
import { TransactionCategoryView } from "./dto/transaction-category.view"
import { TransactionCompactView } from "./dto/transaction.view"
import z from "zod"
import { EPaymentMethod } from "./entities/payment-method.enum"
import { TextContent } from "@modelcontextprotocol/sdk/types"
import { format } from "date-fns"
import { AllowAnonymous } from "@thallesp/nestjs-better-auth"

@Injectable()
@AllowAnonymous()
export class BudgetTool {
  constructor(
    private readonly budgetService: BudgetsService
  ) { }

  @Resource({
    uri: "mcp://budget/categories/{userId}",
    name: "get-categories",
    description: "Get all transaction categories for a user",
    mimeType: "application/json",
  })
  async getCategories({ uri, userId }: { uri: string; userId: string }) {
    const categories = await this.budgetService.getCategories(userId)

    return {
      contents: [
        {
          uri,
          text: JSON.stringify(categories.map(category => new TransactionCategoryView(category))), // serialize como string
          mimeType: "application/json",
        },
      ],
    }
  }

  // @Resource({
  //   uri: "mcp://budget/transactions/{userId}",
  //   name: "get-transactions",
  //   description: "Get all recorded transactions for a user",
  //   mimeType: "application/json",
  // })
  // async getTransactions({ uri, userId }: { uri: string; userId: string }) {
  //   const transactions = await this.budgetService.getTransactions(userId)

  //   return {
  //     contents: [
  //       {
  //         uri,
  //         text: JSON.stringify(transactions.map(category => new TransactionView(category))), // serialize como string
  //         mimeType: "application/json",
  //       },
  //     ],
  //   }
  // }

  @Tool({
    name: "get-transactions",
    description: "Get all recorded transactions for a user",
    parameters: z.object({
      userId: z.string().describe("User ID to retrieve transactions"),
    }),
  })
  async getTransactions(
    { userId }: { userId: string }
  ): Promise<{ content: TextContent[] }> {
    const transactions = await this.budgetService.getTransactions(userId)

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            transactions.map((t) => new TransactionCompactView(t))
          ),
          // mimeType: "application/json",
          _meta: {
            mimeType: "application/json",
          }
        },
      ],
    }
  }

  @Tool({
    name: "register-transaction-item",
    description: "Register a new transaction item using a parent transactionId and  returns the created transaction",
    parameters: z.object({
      userId: z.string().describe("The user ID to register the transaction for"),
      transactionId: z.string().describe("The transaction ID to associate with this item"),
      date: z.string().describe("The date of the transaction item. This date should be in YYYY/MM/DD format (e.g., '2023/10/25')"),
      value: z.string().describe("The value of the transaction item. This should be a numeric value representing the amount of the transaction, e.g., '100.50' for 100 dollars and 50 cents."),
      paymentMethod: z.string().describe(`The payment method used for the transaction item, can only be one of: ${Object.values(EPaymentMethod).join(", ")}`),
    }),
  })
  async registerTransactionItem(
    {
      userId,
      transactionId,
      date,
      value,
      paymentMethod,
    }: {
      userId: string
      transactionId: string
      date: string
      value: number
      paymentMethod: EPaymentMethod
    },
  ) {

    console.log("Registering transaction item with data:", {
      userId,
      transactionId,
      date,
      value,
      paymentMethod,
    })

    const inputSchema = z.object({
      userId: z.string().uuid(),
      transactionId: z.string().uuid(),
      date: z.string().transform((val) => new Date(new Date(val).setHours(12))),
      value: z.string().transform((val) => parseFloat(val)),
      paymentMethod: z.nativeEnum(EPaymentMethod),
    })

    const parsedData = inputSchema.safeParse({
      userId,
      transactionId,
      date,
      value,
      paymentMethod,
    })

    console.log("Parsed input data:", parsedData)

    if (!parsedData.success) {
      console.error("Input validation failed:", parsedData.error)
      throw new Error(`Invalid input data: ${parsedData.error.message}`)
    }

    const createdTransaction = await this.budgetService.createTransactionItem({
      transactionId: parsedData.data.transactionId,
      date: parsedData.data.date,
      value: parsedData.data.value,
      paymentMethod: parsedData.data.paymentMethod,
    }, parsedData.data.userId)

    const output = {
      id: createdTransaction.id,
      value: createdTransaction.value,
      paymentMethod: createdTransaction.paymentMethod,
      date: format(createdTransaction.date, "dd/MM/yy"),
      description: createdTransaction.description,
      category: createdTransaction.categoryDescription,
      categoryType: createdTransaction.type,
    }

    return {
      content: [
        {
          type: "text",
          text: `Transaction item registered with data ${JSON.stringify(output)}`,
          mimeType: "text/plain",
        }
      ]
    }
  }
}