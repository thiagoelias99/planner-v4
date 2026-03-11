import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { FixedIncome, Prisma } from "../../generated/prisma/client"
import { PrismaService } from "../../prisma/prisma.service"
import { CreateFixedIncomeInput } from "./dto/create-fixed-income.input"
import { UpdateFixedIncomeInput } from "./dto/update-fixed-income.input"
import { QueryFixedIncomeInput } from "./dto/query-fixed-income.input"
import { CustomLogger } from "../../utils/logger"

@Injectable()
export class FixedIncomesService {
  constructor(private prisma: PrismaService) { }

  private readonly logger = new CustomLogger("FixedIncomesService")

  async create(userId: string, data: CreateFixedIncomeInput): Promise<FixedIncome> {
    try {
      return await this.prisma.fixedIncome.create({
        data: {
          userId,
          description: data.description,
          agency: data.agency,
          note: data.note,
          initialInvestment: data.initialInvestment,
          currentValue: data.currentValue,
          date: data.date,
          dueDate: data.dueDate,
          fixedRate: data.fixedRate,
          posFixedIndex: data.posFixedIndex,
          retrievedAt: data.retrievedAt,
        }
      })
    } catch (error) {
      const err = error as Error
      this.logger.error(`Unexpected error while creating fixed income, ${err.message}, ${JSON.stringify(data)}`, err.stack)
      throw new InternalServerErrorException(`An unexpected error occurred while creating the fixed income. Please try again later.`)
    }
  }

  async findAll(userId: string, query?: QueryFixedIncomeInput): Promise<{ fixedIncomes: FixedIncome[], total: number }> {
    const {
      page = 1,
      limit = 10,
      orderBy = 'date',
      order = 'desc',
      description,
      agency,
      posFixedIndex,
      dateFrom,
      dateTo,
      dueDateFrom,
      dueDateTo
    } = query || {}

    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.FixedIncomeWhereInput = { userId }

    if (description) {
      where.description = {
        contains: description,
        mode: 'insensitive'
      }
    }

    if (agency) {
      where.agency = {
        contains: agency,
        mode: 'insensitive'
      }
    }

    if (posFixedIndex) {
      where.posFixedIndex = posFixedIndex
    }

    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) {
        where.date.gte = dateFrom
      }
      if (dateTo) {
        where.date.lte = dateTo
      }
    }

    if (dueDateFrom || dueDateTo) {
      where.dueDate = {}
      if (dueDateFrom) {
        where.dueDate.gte = dueDateFrom
      }
      if (dueDateTo) {
        where.dueDate.lte = dueDateTo
      }
    }

    // Build orderBy clause
    const orderByClause: Prisma.FixedIncomeOrderByWithRelationInput = {
      [orderBy]: order
    }

    const [fixedIncomes, total] = await this.prisma.$transaction([
      this.prisma.fixedIncome.findMany({
        skip,
        take: limit,
        where,
        orderBy: orderByClause,
      }),
      this.prisma.fixedIncome.count({ where }),
    ])

    return { fixedIncomes, total }
  }

  async findOne(userId: string, id: string): Promise<FixedIncome> {
    const fixedIncome = await this.prisma.fixedIncome.findUnique({
      where: { id, userId }
    })

    if (!fixedIncome) {
      throw new NotFoundException(`Fixed income with id ${id} not found.`)
    }

    return fixedIncome
  }

  async update(userId: string, id: string, data: UpdateFixedIncomeInput): Promise<FixedIncome> {
    try {
      // Check if fixed income exists
      await this.findOne(userId, id)

      // Update the fixed income
      return await this.prisma.fixedIncome.update({
        where: { id, userId },
        data,
      })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      const err = error as Error
      this.logger.error(`Unexpected error while updating fixed income with id ${id} for user ${userId}, ${err.message}, ${JSON.stringify(data)}`, err.stack)
      throw new InternalServerErrorException(`An unexpected error occurred while updating the fixed income. Please try again later.`)
    }
  }

  async remove(userId: string, id: string): Promise<void> {
    try {
      // Check if fixed income exists
      await this.findOne(userId, id)

      // Delete the fixed income
      await this.prisma.fixedIncome.delete({
        where: { id, userId }
      })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      const err = error as Error
      this.logger.error(`Unexpected error while deleting fixed income with id ${id} for user ${userId}, ${err.message}`, err.stack)
      throw new InternalServerErrorException(`An unexpected error occurred while deleting the fixed income. Please try again later.`)
    }
  }
}
