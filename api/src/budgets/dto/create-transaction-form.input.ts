import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from "class-validator"
import { randomUUID } from "crypto"
import { EPaymentMethod } from "../entities/payment-method.enum"
import { ETransactionCategoryType } from "../entities/transaction-category.entity"
import { ETransactionFrequency } from "../entities/transaction-frequency.enum"

/* eslint-disable indent */
export class CreateTransactionFormInput {
  @ApiProperty()
  @IsDateString()
  from?: Date

  @ApiProperty()
  @IsDateString()
  to?: Date

  @ApiProperty({ example: randomUUID() })
  @IsUUID()
  id: string

  @ApiProperty({ type: Date })
  @IsDateString()
  date: Date

  @ApiProperty({ type: Number })
  @IsNumber()
  value: number

  //Category Data
  @ApiProperty({ example: randomUUID() })
  @IsUUID()
  categoryId: string

  @ApiProperty({ example: "Salary" })
  @IsString()
  categoryDescription: string

  @ApiProperty({ enum: ETransactionCategoryType })
  @IsEnum(ETransactionCategoryType)
  type: ETransactionCategoryType

  // Transaction Data
  @ApiProperty({ example: randomUUID() })
  @IsUUID()
  transactionId: string

  @ApiProperty({ example: "My Salary" })
  @IsString()
  description: string

  @ApiProperty({ enum: EPaymentMethod })
  @IsEnum(EPaymentMethod)
  paymentMethod: EPaymentMethod

  @ApiProperty({ enum: ETransactionFrequency })
  @IsEnum(ETransactionFrequency)
  freq: ETransactionFrequency

  @ApiProperty({ type: Date })
  @IsDateString()
  startDate: Date

  @ApiProperty({ type: Date })
  @IsDateString()
  @IsOptional()
  until?: Date

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(7)
  @IsOptional()
  byDay?: number

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(28)
  @IsOptional()
  byMonthDay?: number

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  byMonth?: number

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  active: boolean
}