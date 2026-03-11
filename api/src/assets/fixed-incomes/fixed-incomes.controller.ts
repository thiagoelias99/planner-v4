import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common'
import { FixedIncomesService } from './fixed-incomes.service'
import { FixedIncomeView, PaginatedFixedIncomeView } from "./dto/fixed-incomes.view"
import { prismaFixedIncomeToFixedIncomeView } from "./utils"
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { CreateFixedIncomeInput } from "./dto/create-fixed-income.input"
import { UpdateFixedIncomeInput } from "./dto/update-fixed-income.input"
import { QueryFixedIncomeInput } from "./dto/query-fixed-income.input"
import { Session, type UserSession } from "@thallesp/nestjs-better-auth"

@ApiTags('Fixed Incomes')
@Controller('fixed-incomes')
export class FixedIncomesController {
  constructor(private readonly fixedIncomesService: FixedIncomesService) { }

  @Post()
  @ApiCreatedResponse({ type: FixedIncomeView, description: 'Fixed income created successfully' })
  async create(
    @Session() session: UserSession,
    @Body() createFixedIncomeDto: CreateFixedIncomeInput
  ): Promise<FixedIncomeView> {
    const fixedIncome = await this.fixedIncomesService.create(session.user.id, createFixedIncomeDto)
    return new FixedIncomeView(prismaFixedIncomeToFixedIncomeView(fixedIncome))
  }

  @Get()
  @ApiOkResponse({ type: PaginatedFixedIncomeView, description: 'List of fixed incomes' })
  async findAll(
    @Session() session: UserSession,
    @Query() query: QueryFixedIncomeInput
  ): Promise<PaginatedFixedIncomeView> {
    const result = await this.fixedIncomesService.findAll(session.user.id, query)

    return new PaginatedFixedIncomeView({
      page: query.page || 1,
      limit: query.limit || 10,
      total: result.total,
      fixedIncomes: result.fixedIncomes.map(f => new FixedIncomeView(prismaFixedIncomeToFixedIncomeView(f)))
    })
  }

  @Get(':id')
  @ApiOkResponse({ type: FixedIncomeView, description: 'Fixed income details' })
  async findOne(
    @Session() session: UserSession,
    @Param('id') id: string
  ): Promise<FixedIncomeView> {
    const fixedIncome = await this.fixedIncomesService.findOne(session.user.id, id)
    return new FixedIncomeView(prismaFixedIncomeToFixedIncomeView(fixedIncome))
  }

  @Put(':id')
  @ApiOkResponse({ type: FixedIncomeView, description: 'Fixed income updated successfully' })
  async update(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() updateFixedIncomeDto: UpdateFixedIncomeInput
  ): Promise<FixedIncomeView> {
    const fixedIncome = await this.fixedIncomesService.update(session.user.id, id, updateFixedIncomeDto)
    return new FixedIncomeView(prismaFixedIncomeToFixedIncomeView(fixedIncome))
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Fixed income deleted successfully' })
  async remove(
    @Session() session: UserSession,
    @Param('id') id: string
  ): Promise<void> {
    await this.fixedIncomesService.remove(session.user.id, id)
  }
}
