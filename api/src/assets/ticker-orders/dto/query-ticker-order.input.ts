import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator"
import { ETickerOrderType } from "./ticker-orders.view"

enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc'
}

enum TickerOrderOrderBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TICKER = 'ticker',
  TYPE = 'type',
  QUANTITY = 'quantity',
  PRICE = 'price'
}

export class QueryTickerOrderInput {
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
    enum: TickerOrderOrderBy
  })
  @IsOptional()
  @IsEnum(TickerOrderOrderBy)
  orderBy?: TickerOrderOrderBy = TickerOrderOrderBy.CREATED_AT

  @ApiPropertyOptional({
    description: 'Order direction',
    enum: OrderDirection
  })
  @IsOptional()
  @IsEnum(OrderDirection)
  order?: OrderDirection = OrderDirection.DESC

  @ApiPropertyOptional({ description: 'Filter by ticker symbol' })
  @IsOptional()
  @IsString()
  ticker?: string

  @ApiPropertyOptional({ description: 'Filter by order type', enum: ETickerOrderType })
  @IsOptional()
  @IsEnum(ETickerOrderType)
  type?: ETickerOrderType
}
