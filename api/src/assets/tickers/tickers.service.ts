import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { Prisma, Ticker } from "../../generated/prisma/client"
import { PrismaService } from "../../prisma/prisma.service"
import { CreateTickerInput } from "./dto/create-ticker.input"
import { CustomLogger } from "../../utils/logger"

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

  async tickers(params?: {
    skip?: number
    take?: number
    where?: Prisma.TickerWhereInput
    orderBy?: Prisma.TickerOrderByWithRelationInput
  }): Promise<{ tickers: Ticker[], total: number }> {

    const { skip, take, where, orderBy } = params || {}

    const [tickers, total] = await this.prisma.$transaction([
      this.prisma.ticker.findMany({
        skip,
        take,
        where,
        orderBy,
      }),
      this.prisma.ticker.count({ where }),
    ])

    return { tickers, total }
  }
}
