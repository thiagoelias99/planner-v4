/* eslint-disable indent */
import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsHexColor, IsOptional, IsString, IsUUID } from "class-validator"
import { randomUUID } from "crypto"
import { ETransactionCategoryType } from "../entities/transaction-category.entity"
import { AvailableIcons } from "../../utils/icons"

export class CreateBudgetCategoryInput {
  @ApiProperty({ example: randomUUID() })
  @IsUUID()
  @IsOptional()
  id?: string

  @ApiProperty({ example: "Salary" })
  @IsString()
  description: string

  @ApiProperty({ enum: ETransactionCategoryType })
  @IsEnum(ETransactionCategoryType)
  type: ETransactionCategoryType

  @ApiProperty()
  @IsEnum(AvailableIcons, { message: "Invalid Icon" })
  @IsOptional()
  icon?: string

  @ApiProperty()
  @IsString()
  @IsHexColor()
  @IsOptional()
  color?: string
}