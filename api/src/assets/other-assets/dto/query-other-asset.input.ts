import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator"
import { EOtherAssetType } from "./other-assets.view"

enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc'
}

enum OtherAssetOrderBy {
  UPDATED_AT = 'updatedAt',
  CREATED_AT = 'createdAt',
  VALUE = 'value',
  DESCRIPTION = 'description'
}

export class QueryOtherAssetInput {
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
    enum: OtherAssetOrderBy
  })
  @IsOptional()
  @IsEnum(OtherAssetOrderBy)
  orderBy?: OtherAssetOrderBy = OtherAssetOrderBy.CREATED_AT

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

  @ApiPropertyOptional({ description: 'Filter by type', enum: EOtherAssetType })
  @IsOptional()
  @IsEnum(EOtherAssetType)
  type?: EOtherAssetType
}
