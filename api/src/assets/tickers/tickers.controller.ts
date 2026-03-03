import { Body, Controller, Get, Post } from '@nestjs/common'
import { TickersService } from './tickers.service'
import { PaginatedTickerView, TickerView } from "./dto/tickers.view"
import { prismaTickerToTickerView } from "./utils"
import { ApiOkResponse } from "@nestjs/swagger"
import { CreateTickerInput } from "./dto/create-ticker.input"

@Controller('tickers')
export class TickersController {
  constructor(private readonly tickersService: TickersService) { }

  @Post()
  async create(
    @Body() createTickerDto: CreateTickerInput
  ): Promise<TickerView> {
    const ticker = await this.tickersService.create(createTickerDto)
    return new TickerView(prismaTickerToTickerView(ticker))
  }

  @Get()
  @ApiOkResponse({ type: PaginatedTickerView })
  async findAll(): Promise<PaginatedTickerView> {
    const ticker = await this.tickersService.tickers()

    return new PaginatedTickerView({
      page: 1,
      limit: 10,
      total: ticker.total,
      tickers: ticker.tickers.map(t => new TickerView(prismaTickerToTickerView(t)))
    })
  }
}
