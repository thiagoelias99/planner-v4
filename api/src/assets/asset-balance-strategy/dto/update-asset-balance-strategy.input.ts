import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsString, MaxLength, Min, Max } from "class-validator"

export class UpdateAssetBalanceStrategyInput {
  @ApiProperty({ example: 10, description: 'Percentage allocation for Cash Box' })
  @IsNumber()
  @Min(0)
  @Max(100)
  cashBox: number

  @ApiProperty({ example: 10, description: 'Percentage allocation for Fixed Income' })
  @IsNumber()
  @Min(0)
  @Max(100)
  fixedIncome: number

  @ApiProperty({ example: 10, description: 'Percentage allocation for Variable Income' })
  @IsNumber()
  @Min(0)
  @Max(100)
  variableIncome: number

  @ApiProperty({ example: 10, description: 'Percentage allocation for Pension' })
  @IsNumber()
  @Min(0)
  @Max(100)
  pension: number

  @ApiProperty({ example: 10, description: 'Percentage allocation for Property' })
  @IsNumber()
  @Min(0)
  @Max(100)
  property: number

  @ApiProperty({ example: 10, description: 'Percentage allocation for Share' })
  @IsNumber()
  @Min(0)
  @Max(100)
  share: number

  @ApiProperty({ example: 10, description: 'Percentage allocation for REIT' })
  @IsNumber()
  @Min(0)
  @Max(100)
  reit: number

  @ApiProperty({ example: 10, description: 'Percentage allocation for International' })
  @IsNumber()
  @Min(0)
  @Max(100)
  international: number

  @ApiProperty({ example: 10, description: 'Percentage allocation for Gold' })
  @IsNumber()
  @Min(0)
  @Max(100)
  gold: number

  @ApiProperty({ example: 10, description: 'Percentage allocation for Crypto' })
  @IsNumber()
  @Min(0)
  @Max(100)
  crypto: number

  @ApiProperty({ example: 0, description: 'Percentage allocation for Other Assets' })
  @IsNumber()
  @Min(0)
  @Max(100)
  other: number

  @ApiProperty({ example: 'My personal strategy', description: 'Additional notes' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string
}
