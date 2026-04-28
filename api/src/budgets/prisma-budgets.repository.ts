import { BadRequestException, NotFoundException } from "@nestjs/common"
import { Prisma, TransactionCategory as PrismaTransactionCategory } from "../generated/prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import { AvailableIcons } from "../utils/icons"
import { BudgetsRepository } from "./budgets.repository"
import { CreateBudgetCategoryInput } from "./dto/create-category.input"
import { EPaymentMethod } from "./entities/payment-method.enum"
import { ETransactionCategoryType, TransactionCategory } from "./entities/transaction-category.entity"
import { ETransactionFrequency } from "./entities/transaction-frequency.enum"
import { BudgetTransactionItem } from "./entities/transaction-item.entity"
import { Transaction } from "./entities/transaction.entity"
import { faker } from "@faker-js/faker"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { UpdateBudgetCategoryInput } from "./dto/update-category.input"
import { CreateBudgetTransactionInput } from "./dto/create-transaction.input"
import { UpdateBudgetTransactionInput } from "./dto/update-transaction.input"
import { CreateBudgetTransactionItemInput } from "./dto/create-transaction-item.input"
import { UpdateBudgetTransactionItemInput } from "./dto/update-transaction-item.input"
import { QueryTransactionInput } from "./dto/query-transaction.input"
import { CreateTransactionFormInput } from "./dto/create-transaction-form.input"
import slugify from "slugify"

export class PrismaBudgetsRepository implements BudgetsRepository {
  private prisma = PrismaService.getInstance()

  private prismaTransactionCategoryDto(prisma: PrismaTransactionCategory): TransactionCategory {
    return {
      id: prisma.id,
      userId: prisma.userId,
      description: prisma.description,
      slug: prisma.slug,
      type: prisma.type as ETransactionCategoryType,
      color: prisma.color || undefined,
      icon: prisma.icon || undefined,
    }
  }

  private prismaTransactionCategoryWithTransactionsDto(prisma: Prisma.TransactionCategoryGetPayload<{
    include: {
      Transactions: {
        include: {
          TransactionCategory: {
            select: {
              description: true,
              type: true,
              icon: true,
            }
          }
        }
      }
    }
  }>): TransactionCategory {
    return {
      id: prisma.id,
      userId: prisma.userId,
      description: prisma.description,
      slug: prisma.slug,
      type: prisma.type as ETransactionCategoryType,
      color: prisma.color || undefined,
      icon: prisma.icon || undefined,
      transactions: prisma.Transactions.map(transaction => this.prismaTransactionDto(transaction))
    }
  }

  private prismaTransactionCategoryWithTransactionItemDto(prisma: Prisma.TransactionCategoryGetPayload<{
    include: {
      Transactions: {
        include: {
          TransactionCategory: {
            select: {
              description: true,
              type: true,
              icon: true,
            }
          },
          TransactionItems: {
            include: {
              Transaction: {
                select: {
                  description: true,
                  freq: true,
                  byDay: true,
                  byMonth: true,
                  byMonthDay: true,
                  imageUrl: true,
                  TransactionCategory: {
                    select: {
                      id: true,
                      slug: true,
                      type: true,
                      description: true,
                      icon: true,
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }>): TransactionCategory {
    return {
      id: prisma.id,
      userId: prisma.userId,
      description: prisma.description,
      slug: prisma.slug,
      type: prisma.type as ETransactionCategoryType,
      color: prisma.color || undefined,
      icon: prisma.icon || undefined,
      transactions: prisma.Transactions.map(transaction => this.prismaTransactionWithItemsDto(transaction))
    }
  }

  private prismaTransactionDto(prisma: Prisma.TransactionGetPayload<{
    include: {
      TransactionCategory: {
        select: {
          description: true,
          type: true,
          icon: true,
        }
      }
    }
  }>): Transaction {
    return {
      id: prisma.id,
      userId: prisma.userId,
      active: prisma.active,
      description: prisma.description,
      categoryId: prisma.categoryId,
      categoryDescription: prisma.TransactionCategory.description,
      type: prisma.TransactionCategory.type as ETransactionCategoryType,
      freq: prisma.freq as ETransactionFrequency,
      paymentMethod: prisma.paymentMethod as EPaymentMethod,
      referenceValue: Number(prisma.referenceValue),
      startDate: prisma.startDate,
      byDay: prisma.byDay || undefined,
      byMonth: prisma.byMonth || undefined,
      byMonthDay: prisma.byMonthDay || undefined,
      count: prisma.count || undefined,
      until: prisma.until || undefined,
      interval: prisma.interval || undefined,
      imageUrl: prisma.imageUrl || undefined,
      categoryIcon: prisma.TransactionCategory.icon as AvailableIcons || undefined,
    }
  }

  private prismaTransactionWithItemsDto(prisma: Prisma.TransactionGetPayload<{
    include: {
      TransactionCategory: {
        select: {
          description: true,
          type: true,
          icon: true,
        }
      },
      TransactionItems: {
        include: {
          Transaction: {
            select: {
              description: true,
              freq: true,
              byDay: true,
              byMonth: true,
              byMonthDay: true,
              imageUrl: true,
              TransactionCategory: {
                select: {
                  id: true,
                  slug: true,
                  type: true,
                  description: true,
                  icon: true,
                }
              }
            }
          }
        }
      }
    }
  }>): Transaction {
    return {
      id: prisma.id,
      userId: prisma.userId,
      active: prisma.active,
      description: prisma.description,
      categoryId: prisma.categoryId,
      categoryDescription: prisma.TransactionCategory.description,
      type: prisma.TransactionCategory.type as ETransactionCategoryType,
      freq: prisma.freq as ETransactionFrequency,
      paymentMethod: prisma.paymentMethod as EPaymentMethod,
      referenceValue: Number(prisma.referenceValue),
      startDate: prisma.startDate,
      byDay: prisma.byDay || undefined,
      byMonth: prisma.byMonth || undefined,
      byMonthDay: prisma.byMonthDay || undefined,
      count: prisma.count || undefined,
      until: prisma.until || undefined,
      interval: prisma.interval || undefined,
      imageUrl: prisma.imageUrl || undefined,
      categoryIcon: prisma.TransactionCategory.icon as AvailableIcons || undefined,
      items: prisma.TransactionItems.map(item => this.prismaTransactionItemDto(item))
    }
  }

  private prismaTransactionItemDto(prisma: Prisma.TransactionItemGetPayload<{
    include: {
      Transaction: {
        select: {
          description: true,
          freq: true,
          byDay: true,
          byMonth: true,
          byMonthDay: true,
          imageUrl: true,
          TransactionCategory: {
            select: {
              id: true,
              slug: true,
              type: true,
              description: true,
              icon: true,
            }
          }
        }
      }
    }
  }>): BudgetTransactionItem {
    return {
      id: prisma.id,
      transactionId: prisma.transactionId,
      value: Number(prisma.value),
      date: prisma.date,
      description: prisma.Transaction.description,
      paymentMethod: prisma.paymentMethod as EPaymentMethod,
      categoryId: prisma.Transaction.TransactionCategory.id,
      categoryDescription: prisma.Transaction.TransactionCategory.description,
      categorySlug: prisma.Transaction.TransactionCategory.slug,
      type: prisma.Transaction.TransactionCategory.type as ETransactionCategoryType,
      freq: prisma.Transaction.freq as ETransactionFrequency,
      byDay: prisma.Transaction.byDay || undefined,
      byMonth: prisma.Transaction.byMonth || undefined,
      byMonthDay: prisma.Transaction.byMonthDay || undefined,
      imageUrl: prisma.Transaction.imageUrl || undefined,
      categoryIcon: prisma.Transaction.TransactionCategory.icon as AvailableIcons || undefined,
      active: prisma.active,
    }
  }

  async createCategory(category: CreateBudgetCategoryInput, userId: string, slug: string): Promise<TransactionCategory> {
    try {
      const categoryDB = await this.prisma.transactionCategory.create({
        data: {
          id: category.id!,
          userId,
          description: category.description,
          slug,
          type: category.type,
          color: category.color || faker.color.rgb(),
          icon: category.icon || undefined,
        }
      })

      return this.prismaTransactionCategoryDto(categoryDB)
    } catch (error) {
      console.error(error)
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new NotFoundException(`Category with id ${category.id} not found`)
        if (error.code === "P2002") throw new BadRequestException(`Category with description ${category.description} already exists`)
      }
      throw error
    }
  }

  async updateCategory(data: UpdateBudgetCategoryInput, categoryId: string, userId: string, slug: string): Promise<TransactionCategory> {
    try {
      const categoryDB = await this.prisma.transactionCategory.update({
        where: { id: categoryId, userId },
        data: {
          description: data.description,
          type: data.type,
          color: data.color || faker.color.rgb(),
          icon: data.icon || undefined,
          slug,
        },
        include: {
          Transactions: {
            include: {
              TransactionCategory: {
                select: {
                  description: true,
                  type: true,
                  icon: true,
                }
              }
            }
          }
        }
      })

      return this.prismaTransactionCategoryWithTransactionsDto(categoryDB)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new NotFoundException(`Category with id ${categoryId} not found`)
      }
      throw error
    }
  }

  async getCategories(userId: string): Promise<TransactionCategory[]> {
    const categories = await this.prisma.transactionCategory.findMany({
      where: { userId },
      include: {
        Transactions: {
          include: {
            TransactionCategory: {
              select: {
                description: true,
                type: true,
                icon: true,
              }
            }
          }
        }
      },
      orderBy: {
        description: "asc"
      }
    })

    return categories.map(category => this.prismaTransactionCategoryWithTransactionsDto(category))
  }

  async getCategoriesWithAllItems(userId: string): Promise<TransactionCategory[]> {
    const categories = await this.prisma.transactionCategory.findMany({
      where: { userId },
      include: {
        Transactions: {
          include: {
            TransactionCategory: {
              select: {
                description: true,
                type: true,
                icon: true,
              }
            },
            TransactionItems: {
              orderBy: { date: "desc" },
              include: {
                Transaction: {
                  select: {
                    description: true,
                    freq: true,
                    byDay: true,
                    byMonth: true,
                    byMonthDay: true,
                    imageUrl: true,
                    TransactionCategory: {
                      select: {
                        id: true,
                        slug: true,
                        type: true,
                        description: true,
                        icon: true,
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        description: "asc"
      }
    })

    return categories.map(category => this.prismaTransactionCategoryWithTransactionItemDto(category))
  }

  async getCategory({ categoryId, userId }: { categoryId: string, userId: string }): Promise<TransactionCategory> {
    try {
      const category = await this.prisma.transactionCategory.findUnique({
        where: { id: categoryId, userId },
        include: {
          Transactions: {
            include: {
              TransactionCategory: {
                select: {
                  description: true,
                  type: true,
                  icon: true,
                }
              }
            }
          }
        }
      })
      if (!category) throw new NotFoundException(`Category with id ${categoryId} not found`)
      return this.prismaTransactionCategoryWithTransactionsDto(category)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new NotFoundException(`Category with id ${categoryId} not found`)
      }
      throw error
    }
  }

  async removeCategory(userId: string, categoryId: string): Promise<void> {
    try {
      await this.prisma.transactionCategory.delete({ where: { id: categoryId, userId } })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new NotFoundException(`Category with id ${categoryId} for user with id ${userId} not found`)
      }
      throw error
    }
  }

  async createTransaction(data: CreateBudgetTransactionInput, userId: string): Promise<Transaction> {
    try {
      const transaction = await this.prisma.transaction.create({
        data: {
          id: data.id!,
          startDate: data.startDate,
          description: data.description,
          referenceValue: data.referenceValue,
          freq: data.freq,
          paymentMethod: data.paymentMethod,
          active: data.active,
          byDay: data.byDay || undefined,
          byMonth: data.byMonth || undefined,
          byMonthDay: data.byMonthDay || undefined,
          count: data.count || undefined,
          until: data.until || undefined,
          interval: data.interval || undefined,
          imageUrl: data.imageUrl || undefined,
          User: { connect: { id: userId } },
          TransactionCategory: { connect: { id: data.categoryId } },
        },
        include: {
          TransactionCategory: {
            select: {
              description: true,
              type: true,
              icon: true,
            }
          }
        }
      })

      return this.prismaTransactionDto(transaction)
    } catch (error) {
      console.error(error)
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new NotFoundException(`Category with id ${data.categoryId} not found`)
        if (error.code === "P2002") throw new BadRequestException(`Invalid data when creating transaction with id ${data.id}`)
      }
      throw error
    }
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      include: {
        TransactionCategory: {
          select: {
            description: true,
            type: true,
            icon: true,
          }
        }
      },
      orderBy: { description: "asc" }
    })
    return transactions.map(transaction => this.prismaTransactionDto(transaction))
  }

  async getTransaction(transactionId: string, userId: string): Promise<Transaction> {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: transactionId, userId },
        include: {
          TransactionCategory: {
            select: {
              description: true,
              type: true,
              icon: true,
            }
          },
          TransactionItems: {
            orderBy: { date: "desc" },
            include: {
              Transaction: {
                select: {
                  description: true,
                  freq: true,
                  byDay: true,
                  byMonth: true,
                  byMonthDay: true,
                  imageUrl: true,
                  TransactionCategory: {
                    select: {
                      id: true,
                      slug: true,
                      type: true,
                      description: true,
                      icon: true,
                    }
                  }
                }
              }
            }
          }
        }
      })
      if (!transaction) throw new NotFoundException(`Transaction with id ${transactionId} not found`)
      return this.prismaTransactionWithItemsDto(transaction)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new NotFoundException(`Transaction with id ${transactionId} not found`)
      }
      throw error
    }
  }

  async updateTransaction(data: UpdateBudgetTransactionInput, id: string, userId: string): Promise<Transaction> {
    try {
      const transactionDB = await this.prisma.transaction.update({
        where: { id, userId },
        data,
        include: {
          TransactionCategory: {
            select: {
              description: true,
              type: true,
              icon: true,
            }
          },
          TransactionItems: {
            orderBy: { date: "desc" },
            include: {
              Transaction: {
                select: {
                  description: true,
                  freq: true,
                  byDay: true,
                  byMonth: true,
                  byMonthDay: true,
                  imageUrl: true,
                  TransactionCategory: {
                    select: {
                      id: true,
                      slug: true,
                      type: true,
                      description: true,
                      icon: true,
                    }
                  }
                }
              }
            }
          }
        }
      })

      return this.prismaTransactionWithItemsDto(transactionDB)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new NotFoundException(`Transaction with id ${id} not found`)
        if (error.code === "P2002") throw new BadRequestException(`Invalid data when updating transaction with id ${id}`)
      }
      throw error
    }
  }

  async removeTransaction(userId: string, transactionId: string): Promise<void> {
    try {
      await this.prisma.transaction.delete({ where: { id: transactionId, userId } })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new NotFoundException(`Transaction with id ${transactionId} for user with id ${userId} not found`)
      }
      throw error
    }
  }

  async createTransactionItem(data: CreateBudgetTransactionItemInput, userId: string): Promise<BudgetTransactionItem> {
    try {
      const transactionItem = await this.prisma.transactionItem.create({
        data: {
          id: data.id!,
          value: data.value,
          date: data.date,
          paymentMethod: data.paymentMethod,
          active: data.active,
          User: { connect: { id: userId } },
          Transaction: { connect: { id: data.transactionId } },
        },
        include: {
          Transaction: {
            select: {
              description: true,
              freq: true,
              byDay: true,
              byMonth: true,
              byMonthDay: true,
              imageUrl: true,
              TransactionCategory: {
                select: {
                  id: true,
                  slug: true,
                  type: true,
                  description: true,
                  icon: true,
                }
              }
            }
          }
        }
      })

      return this.prismaTransactionItemDto(transactionItem)
    } catch (error) {
      console.error(error)
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new NotFoundException(`Transaction with id ${data.transactionId} not found`)
        if (error.code === "P2002") throw new BadRequestException(`Invalid data when creating transaction item with id ${data.id}`)
      }
      throw error
    }
  }

  async updateTransactionItem(data: UpdateBudgetTransactionItemInput, id: string, userId: string): Promise<BudgetTransactionItem> {
    try {
      const transaction = await this.prisma.transactionItem.update({
        where: { id, userId },
        data,
        include: {
          Transaction: {
            select: {
              description: true,
              freq: true,
              byDay: true,
              byMonth: true,
              byMonthDay: true,
              imageUrl: true,
              TransactionCategory: {
                select: {
                  id: true,
                  slug: true,
                  type: true,
                  description: true,
                  icon: true,
                }
              }
            }
          }
        }
      })

      return this.prismaTransactionItemDto(transaction)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new NotFoundException(`Transaction with id ${id} not found`)
        if (error.code === "P2002") throw new BadRequestException(`Invalid data when updating transaction with id ${id}`)
      }
      throw error
    }
  }

  async getTransactionItems(transactionId: string, userId: string): Promise<BudgetTransactionItem[]> {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: transactionId, userId },
        include: {
          TransactionItems: {
            include: {
              Transaction: {
                select: {
                  description: true,
                  freq: true,
                  byDay: true,
                  byMonth: true,
                  byMonthDay: true,
                  imageUrl: true,
                  TransactionCategory: {
                    select: {
                      id: true,
                      slug: true,
                      type: true,
                      description: true,
                      icon: true,
                    }
                  }
                }
              }
            }
          }
        }
      })
      if (!transaction) throw new NotFoundException(`Transaction with id ${transactionId} not found`)

      return transaction.TransactionItems.map(transactionItem => this.prismaTransactionItemDto(transactionItem))

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new NotFoundException(`Transaction with id ${transactionId} not found`)
      }
      throw error
    }
  }

  async getAllTransactionItems(userId: string, query?: QueryTransactionInput): Promise<BudgetTransactionItem[]> {
    const transactions = await this.prisma.transactionItem.findMany({
      where: {
        userId,
        date: {
          lte: query?.endDate,
          gte: query?.startDate,
        }
      },
      include: {
        Transaction: {
          select: {
            description: true,
            freq: true,
            byDay: true,
            byMonth: true,
            byMonthDay: true,
            imageUrl: true,
            TransactionCategory: {
              select: {
                id: true,
                slug: true,
                type: true,
                description: true,
                icon: true,
              }
            }
          }
        }
      },
      orderBy: { date: "desc" }
    })

    return transactions.map(transactionItem => this.prismaTransactionItemDto(transactionItem))
  }

  async removeTransactionItem(transactionItemId: string, userId: string): Promise<void> {
    try {
      await this.prisma.transactionItem.delete({ where: { id: transactionItemId, userId } })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new NotFoundException(`Transaction Item with id ${transactionItemId} not found`)
      }
      throw error
    }
  }

  async createTransactionFromForm(data: CreateTransactionFormInput, userId: string): Promise<void> {
    const slug = slugify(data.categoryDescription, { lower: true, strict: true })
    // Check if a category with same slug already exists
    const category = await this.prisma.transactionCategory.findFirst({
      where: {
        userId,
        slug
      }
    })

    const categoryId = category?.id || data.categoryId

    await this.prisma.transactionItem.create({
      data: {
        id: data.id,
        date: data.date,
        paymentMethod: data.paymentMethod,
        value: data.value,
        active: data.active,
        User: { connect: { id: userId } },
        Transaction: {
          connectOrCreate: {
            where: {
              id: data.transactionId
            },
            create: {
              id: data.transactionId,
              description: data.description,
              freq: data.freq,
              paymentMethod: data.paymentMethod,
              startDate: data.startDate,
              until: data.until || undefined,
              byDay: data.byDay || undefined,
              referenceValue: data.value,
              active: true,
              byMonth: data.byMonth || undefined,
              byMonthDay: data.byMonthDay || undefined,
              count: undefined,
              interval: undefined,
              User: { connect: { id: userId } },
              TransactionCategory: {
                connectOrCreate: {
                  where: {
                    id: categoryId
                  },
                  create: {
                    id: categoryId,
                    description: data.categoryDescription,
                    slug: slugify(data.categoryDescription, { lower: true, strict: true }),
                    type: data.type,
                    color: faker.color.rgb(),
                    User: { connect: { id: userId } }
                  }
                }
              }
            }
          }
        }
      }
    })

    await this.prisma.transaction.update({
      where: { id: data.transactionId },
      data: { referenceValue: data.value }
    })

    return
  }

  async getOrCreateCategoryByDescription(userId: string, input: CreateBudgetCategoryInput): Promise<TransactionCategory> {
    const slug = slugify(input.description, { lower: true, strict: true })
    const category = await this.prisma.transactionCategory.findFirst({
      where: {
        userId: userId,
        slug
      }
    })

    if (category) return this.prismaTransactionCategoryDto(category)

    return this.createCategory({ ...input }, userId, slug)
  }

  async getOrCreateTransactionByDescription(userId: string, input: CreateBudgetTransactionInput): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        userId,
        description: input.description
      },
      include: {
        TransactionCategory: true
      }
    })

    if (transaction) return this.prismaTransactionDto(transaction)

    return this.createTransaction({ ...input }, userId)
  }
}