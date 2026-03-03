import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsOptional, IsPositive, IsString, Matches } from "class-validator"
import { ETickerType } from "./tickers.view"

export class CreateTickerInput {
  @ApiProperty({ example: 'PETR4', description: 'Ticker symbol' })
  @IsString()
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'Symbol must contain only letters and numbers without spaces'
  })
  symbol: string

  @ApiProperty({ example: 'Petroleo Brasileiro SA Petrobras', description: 'Ticker name' })
  @IsString()
  name: string

  @ApiProperty({ example: ETickerType.STOCK, enum: ETickerType, description: 'Ticker type' })
  @IsEnum(ETickerType)
  type: ETickerType

  @ApiPropertyOptional({ example: 40.92, description: 'Ticker price' })
  @IsPositive()
  @IsOptional()
  price?: number
}