import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { Prisma, Ticker } from "../../generated/prisma/client"
import { PrismaService } from "../../prisma/prisma.service"
import { CreateTickerInput } from "./dto/create-ticker.input"
import { CustomLogger } from "../../utils/logger"
import { UpdateTickerInput } from "./dto/update-ticker.input"
import { QueryTickerInput } from "./dto/query-ticker.input"

@Injectable()
export class TickersService {
  constructor(private prisma: PrismaService) { }

  private readonly logger = new CustomLogger("TickersService");

  async create(data: CreateTickerInput): Promise<Ticker> {
    try {
      return await this.prisma.ticker.create({
        data: {
          ...data, price: data.price ?? 0
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(`Ticker with symbol ${data.symbol} already exists.`)
      } else {
        const err = error as Error

        this.logger.error(`Unexpected error while creating ticker, ${err.message}, ${data}`, err.stack)
        throw new InternalServerErrorException(`An unexpected error occurred while creating the ticker. Please try again later.`)
      }
    }
  }

  async tickers(query?: QueryTickerInput): Promise<{ tickers: Ticker[], total: number }> {
    const { page = 1, limit = 10, orderBy = 'symbol', order = 'asc', search, type, autoUpdate } = query || {}

    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.TickerWhereInput = {}

    if (search) {
      where.OR = [
        { symbol: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (type) {
      where.type = type
    }

    if (autoUpdate !== undefined) {
      where.autoUpdate = autoUpdate
    }

    // Build orderBy clause
    const orderByClause: Prisma.TickerOrderByWithRelationInput = {
      [orderBy]: order
    }

    const [tickers, total] = await this.prisma.$transaction([
      this.prisma.ticker.findMany({
        skip,
        take: limit,
        where,
        orderBy: orderByClause,
      }),
      this.prisma.ticker.count({ where }),
    ])

    return { tickers, total }
  }

  async update(id: string, data: UpdateTickerInput): Promise<Ticker> {
    try {
      return await this.prisma.ticker.update({
        where: { id },
        data,
      })
    } catch (error) {
      const err = error as Error

      this.logger.error(`Unexpected error while updating ticker with id ${id}, ${err.message}, ${data}`, err.stack)
      throw new InternalServerErrorException(`An unexpected error occurred while updating the ticker. Please try again later.`)
    }
  }
}
