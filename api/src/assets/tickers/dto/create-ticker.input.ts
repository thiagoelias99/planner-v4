import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsPositive, IsString } from "class-validator"

export class CreateTickerInput {
  @ApiProperty({ example: 'PETR4', description: 'Ticker symbol' })
  @IsString()
  symbol: string

  @ApiProperty({ example: 'Petroleo Brasileiro SA Petrobras', description: 'Ticker name' })
  @IsString()
  name: string

  @ApiProperty({ example: 'Stock', description: 'Ticker type' })
  @IsString()
  type: string

  @ApiPropertyOptional({ example: 40.92, description: 'Ticker price' })
  @IsPositive()
  @IsOptional()
  price?: number
}