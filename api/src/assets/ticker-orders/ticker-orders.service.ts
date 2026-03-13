import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { Prisma, TickerOrder } from "../../generated/prisma/client"
import { PrismaService } from "../../prisma/prisma.service"
import { CreateTickerOrderInput } from "./dto/create-ticker-order.input"
import { UpdateTickerOrderInput } from "./dto/update-ticker-order.input"
import { QueryTickerOrderInput } from "./dto/query-ticker-order.input"
import { CustomLogger } from "../../utils/logger"
import { ETickerType } from "../tickers/dto/tickers.view"
import { ETickerOrderType } from "./dto/ticker-orders.view"

@Injectable()
export class TickerOrdersService {
  constructor(private prisma: PrismaService) { }

  private readonly logger = new CustomLogger("TickerOrdersService")

  async create(userId: string, data: CreateTickerOrderInput): Promise<TickerOrder> {
    try {
      // Validate if ticker exists
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

      // Recupera todas as ordens anteriores ordenado do ticker para o usuário
      const orders = await this.prisma.tickerOrder.findMany({
        where: {
          userId,
          ticker: data.ticker.toUpperCase()
        },
        orderBy: { createdAt: 'asc' }
      })

      const { gainLoss, newMeanPrice, newTotalQuantity, previousMeanPrice, previousTotalQuantity } = this.calculateGainLossAndMeanPrice(orders, data)

      return await this.prisma.tickerOrder.create({
        data: {
          userId,
          ticker: data.ticker.toUpperCase(),
          type: data.type,
          quantity: data.quantity,
          price: data.price,
          gainLoss,
          newMeanPrice,
          newTotalQuantity,
          previousMeanPrice,
          previousTotalQuantity
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
      where.ticker = {
        contains: ticker,
        mode: 'insensitive'
      }
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
      const existingOrder = await this.findOne(userId, id)

      // Update the order
      const updatedOrder = await this.prisma.tickerOrder.update({
        where: { id, userId },
        data,
      })

      // Recalculate all orders for this ticker
      await this.recalculateAndUpdateTickerOrders(userId, existingOrder.ticker)

      return updatedOrder
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
      const existingOrder = await this.findOne(userId, id)
      const ticker = existingOrder.ticker

      // Delete the order
      await this.prisma.tickerOrder.delete({
        where: { id, userId }
      })

      // Recalculate all remaining orders for this ticker
      await this.recalculateAndUpdateTickerOrders(userId, ticker)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      const err = error as Error
      this.logger.error(`Unexpected error while deleting ticker order with id ${id} for user ${userId}, ${err.message}`, err.stack)
      throw new InternalServerErrorException(`An unexpected error occurred while deleting the ticker order. Please try again later.`)
    }
  }

  /**
   * Recalcula e atualiza todas as ordens de um ticker para um usuário
   */
  private async recalculateAndUpdateTickerOrders(userId: string, ticker: string): Promise<void> {
    // Busca todas as ordens do ticker em ordem cronológica
    const orders = await this.prisma.tickerOrder.findMany({
      where: {
        userId,
        ticker
      },
      orderBy: { createdAt: 'asc' }
    })

    let totalCost = 0
    let totalQuantity = 0

    // Recalcula cada ordem em sequência
    for (const order of orders) {
      const previousMeanPrice = totalQuantity > 0 ? totalCost / totalQuantity : 0
      const previousTotalQuantity = totalQuantity

      let gainLoss = 0
      let newMeanPrice: number

      if (order.type === ETickerOrderType.BUY) {
        totalCost += order.price.toNumber() * order.quantity
        totalQuantity += order.quantity
        newMeanPrice = totalQuantity > 0 ? totalCost / totalQuantity : 0
      } else {
        // SELL: calcula ganho/perda baseado no preço médio anterior
        gainLoss = (order.price.toNumber() - previousMeanPrice) * order.quantity
        totalQuantity -= order.quantity
        // Mantém o preço médio e ajusta o custo total proporcionalmente
        newMeanPrice = previousMeanPrice
        totalCost = newMeanPrice * totalQuantity
      }

      // Atualiza a ordem no banco com os valores recalculados
      await this.prisma.tickerOrder.update({
        where: { id: order.id },
        data: {
          gainLoss,
          newMeanPrice,
          newTotalQuantity: totalQuantity,
          previousMeanPrice,
          previousTotalQuantity
        }
      })
    }
  }

  private calculateGainLossAndMeanPrice(orders: TickerOrder[], newOrder: CreateTickerOrderInput): { gainLoss: number, newMeanPrice: number, newTotalQuantity: number, previousMeanPrice: number, previousTotalQuantity: number } {
    let totalCost = 0
    let totalQuantity = 0

    // Processar todas as ordens anteriores para chegar ao estado atual
    for (const order of orders) {
      if (order.type === ETickerOrderType.BUY) {
        totalCost += order.price.toNumber() * order.quantity
        totalQuantity += order.quantity
      } else {
        // SELL: mantém o preço médio, reduz quantidade e ajusta custo proporcionalmente
        const currentMeanPrice = totalQuantity > 0 ? totalCost / totalQuantity : 0
        totalQuantity -= order.quantity
        totalCost = currentMeanPrice * totalQuantity
      }
    }

    const previousMeanPrice = totalQuantity > 0 ? totalCost / totalQuantity : 0
    const previousTotalQuantity = totalQuantity

    let gainLoss = 0
    let newMeanPrice: number

    if (newOrder.type === 'BUY') {
      totalCost += newOrder.price * newOrder.quantity
      totalQuantity += newOrder.quantity
      newMeanPrice = totalQuantity > 0 ? totalCost / totalQuantity : 0
    } else {
      // SELL: calcula ganho/perda baseado no preço médio anterior
      gainLoss = (newOrder.price - previousMeanPrice) * newOrder.quantity
      totalQuantity -= newOrder.quantity
      // Mantém o preço médio e ajusta o custo total proporcionalmente
      newMeanPrice = previousMeanPrice
      totalCost = newMeanPrice * totalQuantity
    }

    return {
      gainLoss,
      newMeanPrice,
      newTotalQuantity: totalQuantity,
      previousMeanPrice,
      previousTotalQuantity
    }
  }
}
