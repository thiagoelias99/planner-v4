import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from "class-validator"
import { Type } from "class-transformer"
import { EUserRole } from "../utils/user-role"

enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc'
}

enum UserOrderBy {
  EMAIL = 'email',
  NAME = 'name',
  ROLE = 'role',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt'
}

export class QueryUserInput {
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
    enum: UserOrderBy
  })
  @IsOptional()
  @IsEnum(UserOrderBy)
  orderBy?: UserOrderBy = UserOrderBy.NAME

  @ApiPropertyOptional({
    description: 'Order direction',
    enum: OrderDirection
  })
  @IsOptional()
  @IsEnum(OrderDirection)
  order?: OrderDirection = OrderDirection.ASC

  @ApiPropertyOptional({ description: 'Search in name and email' })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ description: 'Filter by user role', enum: EUserRole })
  @IsOptional()
  @IsEnum(EUserRole)
  role?: EUserRole
}