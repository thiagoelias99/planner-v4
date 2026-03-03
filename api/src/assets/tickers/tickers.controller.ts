import { Body, Controller, Get, HttpCode, NotImplementedException, Param, Post, Put, Query } from '@nestjs/common'
import { TickersService } from './tickers.service'
import { PaginatedTickerView, TickerView } from "./dto/tickers.view"
import { prismaTickerToTickerView } from "./utils"
import { ApiNoContentResponse, ApiOkResponse } from "@nestjs/swagger"
import { CreateTickerInput } from "./dto/create-ticker.input"
import { UpdateTickerInput } from "./dto/update-ticker.input"
import { QueryTickerInput } from "./dto/query-ticker.input"
import { Roles } from "@thallesp/nestjs-better-auth"

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

  @Post('auto-update')
  @Roles(["admin"])
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Auto-updated tickers' })
  async autoUpdateTickers(): Promise<void> {
    await this.tickersService.autoUpdateTickers()
  }

  @Get()
  @ApiOkResponse({ type: PaginatedTickerView })
  async findAll(
    @Query() query: QueryTickerInput
  ): Promise<PaginatedTickerView> {
    const ticker = await this.tickersService.tickers(query)

    return new PaginatedTickerView({
      page: query.page || 1,
      limit: query.limit || 10,
      total: ticker.total,
      tickers: ticker.tickers.map(t => new TickerView(prismaTickerToTickerView(t)))
    })
  }

  @Put(':id')
  @ApiOkResponse({ type: TickerView })
  async updateAll(
    @Param('id') id: string,
    @Body() updateTickerDto: UpdateTickerInput
  ): Promise<TickerView> {
    const ticker = await this.tickersService.update(id, updateTickerDto)
    return new TickerView(prismaTickerToTickerView(ticker))
  }
}
