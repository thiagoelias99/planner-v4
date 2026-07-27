import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDateString, IsEnum, IsInt, IsOptional, Max, Min } from "class-validator"

enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc'
}

enum BudgetOrderBy {
  DATE = 'date',
  DESCRIPTION = 'description',
  VALUE = 'value',
  CATEGORY = 'category'
}

export class QueryPaginatedBudgetInput {
  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 16 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 16

  @ApiPropertyOptional({ description: 'Start date for filtering (optional)' })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  startDate?: Date

  @ApiPropertyOptional({ description: 'End date for filtering (optional)' })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  endDate?: Date

  @ApiPropertyOptional({
    description: 'Field to order by',
    enum: BudgetOrderBy,
    default: BudgetOrderBy.DATE
  })
  @IsOptional()
  @IsEnum(BudgetOrderBy)
  orderBy?: BudgetOrderBy = BudgetOrderBy.DATE

  @ApiPropertyOptional({
    description: 'Order direction',
    enum: OrderDirection,
    default: OrderDirection.DESC
  })
  @IsOptional()
  @IsEnum(OrderDirection)
  order?: OrderDirection = OrderDirection.DESC
}
