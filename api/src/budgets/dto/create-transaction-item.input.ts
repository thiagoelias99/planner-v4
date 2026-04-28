/* eslint-disable indent */
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID, IsOptional, IsDateString, IsNumber, IsEnum, IsBoolean } from "class-validator"
import { randomUUID } from "crypto"
import { EPaymentMethod } from "../entities/payment-method.enum"

export class CreateBudgetTransactionItemInput {
  @ApiProperty({ example: randomUUID() })
  @IsUUID()
  @IsOptional()
  id?: string

  @ApiProperty({ example: randomUUID() })
  @IsUUID()
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