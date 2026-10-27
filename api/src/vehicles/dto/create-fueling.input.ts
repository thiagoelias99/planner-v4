import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator"
import { EVehicleFuelType } from "./vehicles.view"
import { EPaymentMethod } from "../../budgets/entities/payment-method.enum"

export class CreateFuellingInput {
  @ApiProperty({ example: new Date(), description: 'Date of the fueling' })
  @IsDateString()
  date: Date

  @ApiProperty({ example: 12000, description: 'Odometer reading at the time of fueling' })
  @IsNumber()
  @IsPositive()
  odometer: number

  @ApiProperty({ example: EVehicleFuelType.GASOLINE, description: 'Type of fuel' })
  @IsEnum(EVehicleFuelType)
  fuelType: EVehicleFuelType

  @ApiProperty({ example: 50, description: 'Amount of fuel in liters' })
  @IsNumber()
  @IsPositive()
  liters: number

  @ApiProperty({ example: 200, description: 'Total amount spent on the fueling' })
  @IsNumber()
  @IsPositive()
  totalAmount: number

  @ApiProperty({ enum: EPaymentMethod })
  @IsEnum(EPaymentMethod)
  paymentMethod: EPaymentMethod

  @ApiProperty({ example: true, description: 'Indicates if the tank was filled completely' })
  @IsNotEmpty()
  fullTank: boolean
}
