import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator"
import { EOtherAssetType } from "./other-assets.view"

export class CreateOtherAssetInput {
  @ApiProperty({ example: 'Savings Account', description: 'Description of the other asset' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string

  @ApiPropertyOptional({ example: 'Banco XYZ', description: 'Financial agency/institution' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  agency?: string

  @ApiPropertyOptional({ example: 'Emergency fund', description: 'Additional notes' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string

  @ApiProperty({ example: 10000.00, description: 'Current value of the asset' })
  @IsNumber()
  @IsPositive()
  value: number

  @ApiProperty({ example: EOtherAssetType.CASH_BOX, enum: EOtherAssetType, description: 'Type of the asset' })
  @IsEnum(EOtherAssetType)
  type: EOtherAssetType
}
