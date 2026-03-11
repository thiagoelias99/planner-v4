import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDate, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator"
import { EPosFixedIndex } from "./fixed-incomes.view"

enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc'
}

enum FixedIncomeOrderBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  DATE = 'date',
  DUE_DATE = 'dueDate',
  INITIAL_INVESTMENT = 'initialInvestment',
  CURRENT_VALUE = 'currentValue',
  DESCRIPTION = 'description'
}

export class QueryFixedIncomeInput {
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
    enum: FixedIncomeOrderBy
  })
  @IsOptional()
  @IsEnum(FixedIncomeOrderBy)
  orderBy?: FixedIncomeOrderBy = FixedIncomeOrderBy.DATE

  @ApiPropertyOptional({
    description: 'Order direction',
    enum: OrderDirection
  })
  @IsOptional()
  @IsEnum(OrderDirection)
  order?: OrderDirection = OrderDirection.DESC

  @ApiPropertyOptional({ description: 'Filter by description (case insensitive search)' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: 'Filter by agency (case insensitive search)' })
  @IsOptional()
  @IsString()
  agency?: string

  @ApiPropertyOptional({ description: 'Filter by post-fixed index', enum: EPosFixedIndex })
  @IsOptional()
  @IsEnum(EPosFixedIndex)
  posFixedIndex?: EPosFixedIndex

  @ApiPropertyOptional({ description: 'Filter by investments starting from this date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date

  @ApiPropertyOptional({ description: 'Filter by investments starting until this date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTo?: Date

  @ApiPropertyOptional({ description: 'Filter by investments maturing from this date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDateFrom?: Date

  @ApiPropertyOptional({ description: 'Filter by investments maturing until this date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDateTo?: Date
}
