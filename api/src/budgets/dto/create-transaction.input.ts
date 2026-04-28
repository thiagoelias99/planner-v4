/* eslint-disable indent */
import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUrl, IsUUID, Max, Min } from "class-validator"
import { randomUUID } from "crypto"
import { EPaymentMethod } from "../entities/payment-method.enum"
import { ETransactionFrequency } from "../entities/transaction-frequency.enum"

export class CreateBudgetTransactionInput {
  @ApiProperty({ example: randomUUID() })
  @IsString()
  @IsOptional()
  id?: string

  @ApiProperty({ example: "Salary" })
  @IsString()
  description: string

  @ApiProperty({ type: Number })
  @IsNumber()
  referenceValue: number

  @ApiProperty({ enum: EPaymentMethod })
  @IsEnum(EPaymentMethod)
  paymentMethod: EPaymentMethod

  @ApiProperty({ example: randomUUID() })
  @IsString()
  categoryId: string

  @ApiProperty({ enum: ETransactionFrequency })
  @IsEnum(ETransactionFrequency)
  freq: ETransactionFrequency

  @ApiProperty({ type: Number })
  @IsInt()
  @IsOptional()
  interval?: number

  @ApiProperty({ type: Number })
  @IsInt()
  @IsOptional()
  count?: number

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
  @Max(31)
  @IsOptional()
  byMonthDay?: number

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  byMonth?: number

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active?: boolean

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  imageUrl?: string
}