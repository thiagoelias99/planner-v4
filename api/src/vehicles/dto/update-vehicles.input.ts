import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator"
import { EVehicleFuelType, EVehicleStatus } from "./vehicles.view"

export class UpdateVehiclesInput {
  @ApiPropertyOptional({ example: 'Honda', description: 'Brand of the vehicle' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  brand?: string

  @ApiPropertyOptional({ example: 'Fit', description: 'Model of the vehicle' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  model?: string

  @ApiPropertyOptional({ example: 2008, description: 'Year of the vehicle' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  year?: number

  @ApiPropertyOptional({ example: 'ABC1234', description: 'License plate of the vehicle' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  plate?: string

  @ApiPropertyOptional({ example: 'Prata', description: 'Color of the vehicle' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string

  @ApiPropertyOptional({ example: EVehicleFuelType.GASOLINE, description: 'Fuel type of the vehicle' })
  @IsOptional()
  @IsEnum(EVehicleFuelType)
  fuelType?: EVehicleFuelType

  @ApiPropertyOptional({ example: '2015-02-02', description: 'Purchase date of the vehicle' })
  @IsDateString()
  @IsOptional()
  purchaseDate?: Date

  @ApiPropertyOptional({ example: 25000.00, description: 'Purchase price of the vehicle' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  purchasePrice?: number

  @ApiPropertyOptional({ example: 15000, description: 'Current odometer reading of the vehicle' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  currentOdometer?: number

  @ApiPropertyOptional({ example: 'Regular maintenance required', description: 'Additional notes about the vehicle' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string

  @ApiPropertyOptional({ example: 'ACTIVE', description: 'Status of the vehicle' })
  @IsOptional()
  @IsEnum(EVehicleStatus)
  status?: EVehicleStatus

  @ApiPropertyOptional({ example: 'j0xyblx0b3cybjkefk3ezru6', description: 'ID of the fuelling transaction associated with the vehicle' })
  @IsOptional()
  @IsString()
  @MaxLength(36)
  fuellingTransactionId?: string

  @ApiPropertyOptional({ example: 'j0xyblx0b3cybjkefk3ezru6', description: 'ID of the maintenance transaction associated with the vehicle' })
  @IsOptional()
  @IsString()
  @MaxLength(36)
  maintenanceTransactionId?: string
}
