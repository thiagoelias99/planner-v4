import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common'
import { TickerOrdersService } from './ticker-orders.service'
import { PaginatedTickerOrderView, TickerOrderView } from "./dto/ticker-orders.view"
import { prismaTickerOrderToTickerOrderView } from "./utils"
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { CreateTickerOrderInput } from "./dto/create-ticker-order.input"
import { UpdateTickerOrderInput } from "./dto/update-ticker-order.input"
import { QueryTickerOrderInput } from "./dto/query-ticker-order.input"
import { Session, type UserSession } from "@thallesp/nestjs-better-auth"

@ApiTags('Ticker Orders')
@Controller('ticker-orders')
export class TickerOrdersController {
  constructor(private readonly tickerOrdersService: TickerOrdersService) { }

  @Post()
  @ApiCreatedResponse({ type: TickerOrderView, description: 'Ticker order created successfully' })
  async create(
    @Session() session: UserSession,
    @Body() createTickerOrderDto: CreateTickerOrderInput
  ): Promise<TickerOrderView> {
    const tickerOrder = await this.tickerOrdersService.create(session.user.id, createTickerOrderDto)
    return new TickerOrderView(prismaTickerOrderToTickerOrderView(tickerOrder))
  }

  @Get()
  @ApiOkResponse({ type: PaginatedTickerOrderView, description: 'List of ticker orders' })
  async findAll(
    @Session() session: UserSession,
    @Query() query: QueryTickerOrderInput
  ): Promise<PaginatedTickerOrderView> {
    const result = await this.tickerOrdersService.findAll(session.user.id, query)

    return new PaginatedTickerOrderView({
      page: query.page || 1,
      limit: query.limit || 10,
      total: result.total,
      tickerOrders: result.tickerOrders.map(t => new TickerOrderView(prismaTickerOrderToTickerOrderView(t)))
    })
  }

  @Put(':id')
  @ApiOkResponse({ type: TickerOrderView, description: 'Ticker order updated successfully' })
  async update(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() updateTickerOrderDto: UpdateTickerOrderInput
  ): Promise<TickerOrderView> {
    const tickerOrder = await this.tickerOrdersService.update(session.user.id, id, updateTickerOrderDto)
    return new TickerOrderView(prismaTickerOrderToTickerOrderView(tickerOrder))
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Ticker order deleted successfully' })
  async remove(
    @Session() session: UserSession,
    @Param('id') id: string
  ): Promise<void> {
    await this.tickerOrdersService.remove(session.user.id, id)
  }
}
