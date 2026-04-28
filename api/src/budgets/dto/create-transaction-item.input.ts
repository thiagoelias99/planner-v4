/* eslint-disable indent */
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsDateString, IsNumber, IsEnum, IsBoolean, IsString } from "class-validator"
import { randomUUID } from "crypto"
import { EPaymentMethod } from "../entities/payment-method.enum"

export class CreateBudgetTransactionItemInput {
  @ApiProperty({ example: randomUUID() })
  @IsString()
  @IsOptional()
  id?: string

  @ApiProperty({ example: randomUUID() })
  @IsString()
  transactionId: string

  @ApiProperty({ type: Date })
  @IsDateString()
  date: Date

  @ApiProperty({ type: Number })
  @IsNumber()
  value: number

  @ApiProperty({ enum: EPaymentMethod })
  @IsEnum(EPaymentMethod)
  paymentMethod: EPaymentMethod

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean
}