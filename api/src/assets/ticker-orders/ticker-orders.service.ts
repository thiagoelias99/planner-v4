import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { Prisma, TickerOrder } from "../../generated/prisma/client"
import { PrismaService } from "../../prisma/prisma.service"
import { CreateTickerOrderInput } from "./dto/create-ticker-order.input"
import { UpdateTickerOrderInput } from "./dto/update-ticker-order.input"
import { QueryTickerOrderInput } from "./dto/query-ticker-order.input"
import { CustomLogger } from "../../utils/logger"
import { ETickerType } from "../tickers/dto/tickers.view"

@Injectable()
export class TickerOrdersService {
  constructor(private prisma: PrismaService) { }

  private readonly logger = new CustomLogger("TickerOrdersService")

  async create(userId: string, data: CreateTickerOrderInput): Promise<TickerOrder> {
    try {
      // Validate ticker exists
      const tickerExists = await this.prisma.ticker.findUnique({
        where: { symbol: data.ticker.toUpperCase() }
      })

      if (!tickerExists) {
        await this.prisma.ticker.create({
          data: {
            name: data.ticker.toUpperCase(), symbol: data.ticker.toUpperCase(), price: data.price, type: ETickerType.STOCK, autoUpdate: false
          }
        })
      }

      return await this.prisma.tickerOrder.create({
        data: {
          userId,
          ticker: data.ticker.toUpperCase(),
          type: data.type,
          quantity: data.quantity,
          price: data.price,
        }
      })
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }

      const err = error as Error
      this.logger.error(`Unexpected error while creating ticker order, ${err.message}, ${JSON.stringify(data)}`, err.stack)
      throw new InternalServerErrorException(`An unexpected error occurred while creating the ticker order. Please try again later.`)
    }
  }

  async findAll(userId: string, query?: QueryTickerOrderInput): Promise<{ tickerOrders: TickerOrder[], total: number }> {
    const { page = 1, limit = 10, orderBy = 'createdAt', order = 'desc', ticker, type } = query || {}

    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.TickerOrderWhereInput = { userId }

    if (ticker) {
      where.ticker = ticker
    }

    if (type) {
      where.type = type
    }

    // Build orderBy clause
    const orderByClause: Prisma.TickerOrderOrderByWithRelationInput = {
      [orderBy]: order
    }

    const [tickerOrders, total] = await this.prisma.$transaction([
      this.prisma.tickerOrder.findMany({
        skip,
        take: limit,
        where,
        orderBy: orderByClause,
      }),
      this.prisma.tickerOrder.count({ where }),
    ])

    return { tickerOrders, total }
  }

  async findOne(userId: string, id: string): Promise<TickerOrder> {
    const tickerOrder = await this.prisma.tickerOrder.findUnique({
      where: { id, userId }
    })

    if (!tickerOrder) {
      throw new NotFoundException(`Ticker order with id ${id} not found.`)
    }

    return tickerOrder
  }

  async update(userId: string, id: string, data: UpdateTickerOrderInput): Promise<TickerOrder> {
    try {
      // Check if ticker order exists
      await this.findOne(userId, id)

      return await this.prisma.tickerOrder.update({
        where: { id, userId },
        data,
      })
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error
      }

      const err = error as Error
      this.logger.error(`Unexpected error while updating ticker order with id ${id} for user ${userId}, ${err.message}, ${JSON.stringify(data)}`, err.stack)
      throw new InternalServerErrorException(`An unexpected error occurred while updating the ticker order. Please try again later.`)
    }
  }

  async remove(userId: string, id: string): Promise<void> {
    try {
      // Check if ticker order exists
      await this.findOne(userId, id)

      await this.prisma.tickerOrder.delete({
        where: { id, userId }
      })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      const err = error as Error
      this.logger.error(`Unexpected error while deleting ticker order with id ${id} for user ${userId}, ${err.message}`, err.stack)
      throw new InternalServerErrorException(`An unexpected error occurred while deleting the ticker order. Please try again later.`)
    }
  }
}
