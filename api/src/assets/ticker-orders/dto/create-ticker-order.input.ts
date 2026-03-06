import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsInt, IsPositive, IsString, Matches } from "class-validator"
import { ETickerOrderType } from "./ticker-orders.view"

export class CreateTickerOrderInput {
  @ApiProperty({ example: 'PETR4', description: 'Ticker symbol' })
  @IsString()
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'Ticker must contain only letters and numbers without spaces'
  })
  ticker: string

  @ApiProperty({ example: ETickerOrderType.BUY, enum: ETickerOrderType, description: 'Order type' })
  @IsEnum(ETickerOrderType)
  type: ETickerOrderType

  @ApiProperty({ example: 100, description: 'Quantity of shares' })
  @IsInt()
  @IsPositive()
  quantity: number

  @ApiProperty({ example: 40.92, description: 'Price per share' })
  @IsPositive()
  price: number
}
