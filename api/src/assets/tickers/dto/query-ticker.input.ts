import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator"
import { ETickerType } from "./tickers.view"

enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc'
}

enum TickerOrderBy {
  SYMBOL = 'symbol',
  NAME = 'name',
  TYPE = 'type',
  PRICE = 'price',
  CHANGE = 'change',
  CHANGE_PERCENT = 'changePercent',
  UPDATED_AT = 'updatedAt'
}

export class QueryTickerInput {
  @ApiPropertyOptional({ description: 'Page number', minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10

  @ApiPropertyOptional({
    description: 'Field to order by',
    enum: TickerOrderBy
  })
  @IsOptional()
  @IsEnum(TickerOrderBy)
  orderBy?: TickerOrderBy = TickerOrderBy.SYMBOL

  @ApiPropertyOptional({
    description: 'Order direction',
    enum: OrderDirection
  })
  @IsOptional()
  @IsEnum(OrderDirection)
  order?: OrderDirection = OrderDirection.ASC

  @ApiPropertyOptional({ description: 'Search in symbol and name' })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ description: 'Filter by ticker type', enum: ETickerType })
  @IsOptional()
  @IsEnum(ETickerType)
  type?: ETickerType

  @ApiPropertyOptional({ description: 'Filter by auto update status' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  autoUpdate?: boolean
}