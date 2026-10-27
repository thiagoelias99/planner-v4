import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Vehicle } from "../../generated/prisma/client"

export enum EVehicleFuelType {
  GASOLINE = 'GASOLINE',
  ETHANOL = 'ETHANOL',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID'
}

export enum EVehicleStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  SOLD = 'SOLD'
}

export interface IVehicleView {
  id: string
  brand: string
  model: string
  year: number
  plate?: string
  color?: string
  fuelType: EVehicleFuelType
  purchaseDate?: Date
  purchasePrice?: number
  currentOdometer?: number
  notes?: string
  status?: EVehicleStatus
  createdAt: Date
  updatedAt: Date
  fuellingTransactionId?: string
  maintenanceTransactionId?: string
}

export class VehicleView implements IVehicleView {
  constructor(data: IVehicleView) {
    this.id = data.id
    this.brand = data.brand
    this.model = data.model
    this.year = data.year
    this.plate = data.plate
    this.color = data.color
    this.fuelType = data.fuelType
    this.purchaseDate = data.purchaseDate ? new Date(data.purchaseDate) : undefined
    this.purchasePrice = data.purchasePrice
    this.currentOdometer = data.currentOdometer
    this.notes = data.notes
    this.status = data.status
    this.fuellingTransactionId = data.fuellingTransactionId
    this.maintenanceTransactionId = data.maintenanceTransactionId
    this.createdAt = new Date(data.createdAt)
    this.updatedAt = new Date(data.updatedAt)
  }

  static fromPrisma(vehicle: Vehicle): VehicleView {
    return new VehicleView({
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.plate || undefined,
      color: vehicle.color || undefined,
      fuelType: vehicle.fuelType as EVehicleFuelType,
      purchaseDate: vehicle.purchaseDate || undefined,
      purchasePrice: Number(vehicle.purchasePrice) || 0,
      currentOdometer: vehicle.currentOdometer || undefined,
      notes: vehicle.notes || undefined,
      status: vehicle.status as EVehicleStatus,
      fuellingTransactionId: vehicle.fuellingTransactionId || undefined,
      maintenanceTransactionId: vehicle.maintenanceTransactionId || undefined,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt
    })
  }

  @ApiProperty({ example: 'ea951cd1-31ce-42a5-8056-466db3431e63' })
  id: string

  @ApiProperty({ example: 'Toyota' })
  brand: string

  @ApiProperty({ example: 'Corolla' })
  model: string

  @ApiProperty({ example: 2020 })
  year: number

  @ApiPropertyOptional({ example: 'ABC-1234' })
  plate?: string

  @ApiPropertyOptional({ example: 'Red' })
  color?: string

  @ApiProperty({ example: EVehicleFuelType.GASOLINE, enum: EVehicleFuelType })
  fuelType: EVehicleFuelType

  @ApiPropertyOptional({ example: new Date() })
  purchaseDate?: Date

  @ApiPropertyOptional({ example: 25000 })
  purchasePrice?: number

  @ApiPropertyOptional({ example: 12000 })
  currentOdometer?: number

  @ApiPropertyOptional({ example: 'Some notes about the vehicle' })
  notes?: string

  @ApiPropertyOptional({ example: EVehicleStatus.ACTIVE, enum: EVehicleStatus })
  status?: EVehicleStatus

  @ApiProperty({ example: new Date() })
  createdAt: Date

  @ApiProperty({ example: new Date() })
  updatedAt: Date

  @ApiPropertyOptional({ example: 'ea951cd1-31ce-42a5-8056-466db3431e63' })
  fuellingTransactionId?: string

  @ApiPropertyOptional({ example: 'ea951cd1-31ce-42a5-8056-466db3431e63' })
  maintenanceTransactionId?: string
}