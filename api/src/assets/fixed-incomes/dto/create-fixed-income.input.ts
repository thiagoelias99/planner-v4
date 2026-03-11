import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from "class-validator"
import { EPosFixedIndex } from "./fixed-incomes.view"

export class CreateFixedIncomeInput {
  @ApiProperty({ example: 'CDB Banco XYZ 120% CDI', description: 'Description of the fixed income investment' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string

  @ApiPropertyOptional({ example: 'Banco XYZ', description: 'Financial agency/institution' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  agency?: string

  @ApiPropertyOptional({ example: 'Liquidez D+1', description: 'Additional notes' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string

  @ApiProperty({ example: 10000.00, description: 'Initial investment amount' })
  @IsNumber()
  @IsPositive()
  initialInvestment: number

  @ApiProperty({ example: 10500.00, description: 'Current value of the investment' })
  @IsNumber()
  @IsPositive()
  currentValue: number

  @ApiProperty({ example: '2026-01-15T00:00:00.000Z', description: 'Investment start date' })
  @Type(() => Date)
  @IsDate()
  date: Date

  @ApiProperty({ example: '2027-01-15T00:00:00.000Z', description: 'Investment maturity/due date' })
  @Type(() => Date)
  @IsDate()
  dueDate: Date

  @ApiProperty({ example: 120.00, description: 'Fixed rate percentage' })
  @IsNumber()
  @Min(0)
  fixedRate: number

  @ApiProperty({ example: EPosFixedIndex.CDI, enum: EPosFixedIndex, description: 'Post-fixed index type' })
  @IsEnum(EPosFixedIndex)
  posFixedIndex: EPosFixedIndex

  @ApiPropertyOptional({ example: '2026-03-11T00:00:00.000Z', description: 'Date when the current value was retrieved' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  retrievedAt?: Date
}
