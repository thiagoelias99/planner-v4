import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Prisma, Vehicle } from "../../generated/prisma/client"

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
  currentPrice?: number
  chassis?: string
  fipeCode?: string
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
    this.currentPrice = data.currentPrice
    this.chassis = data.chassis
    this.fipeCode = data.fipeCode
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
      updatedAt: vehicle.updatedAt,
      currentPrice: Number(vehicle.currentPrice) || 0,
      chassis: vehicle.chassis || undefined,
      fipeCode: vehicle.fipeCode || undefined
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

  @ApiPropertyOptional({ example: 50000.00 })
  currentPrice?: number

  @ApiPropertyOptional({ example: 'ABC123456789' })
  chassis?: string

  @ApiPropertyOptional({ example: '014045-7' })
  fipeCode?: string
}

export class VehicleFuelingView {
  constructor(data: Prisma.FuelingGetPayload<{}>) {
    this.id = data.id
    this.vehicleId = data.vehicleId
    this.transactionId = data.transactionId || undefined
    this.date = new Date(data.date)
    this.odometer = data.odometer
    this.fuelType = data.fuelType as EVehicleFuelType
    this.liters = Number(data.liters)
    this.pricePerLiter = Number(data.pricePerLiter)
    this.totalAmount = Number(data.totalAmount)
    this.station = data.station || undefined
    this.fullTank = data.fullTank
    this.notes = data.notes || undefined
    this.createdAt = new Date(data.createdAt)
    this.updatedAt = new Date(data.updatedAt)
  }

  @ApiProperty({ example: 'ea951cd1-31ce-42a5-8056-466db3431e63' })
  id: string

  @ApiProperty({ example: 'ea951cd1-31ce-42a5-8056-466db3431e63' })
  vehicleId: string

  @ApiPropertyOptional({ example: 'ea951cd1-31ce-42a5-8056-466db3431e63' })
  transactionId?: string

  @ApiProperty({ example: new Date() })
  date: Date

  @ApiProperty({ example: 12000 })
  odometer: number

  @ApiProperty({ example: EVehicleFuelType.GASOLINE, enum: EVehicleFuelType })
  fuelType: EVehicleFuelType

  @ApiProperty({ example: 50 })
  liters: number

  @ApiProperty({ example: 5.5 })
  pricePerLiter: number

  @ApiProperty({ example: 275 })
  totalAmount: number

  @ApiPropertyOptional({ example: 'Some station' })
  station?: string

  @ApiProperty({ example: true })
  fullTank: boolean

  @ApiPropertyOptional({ example: 'Some notes' })
  notes?: string

  @ApiProperty({ example: new Date() })
  createdAt: Date

  @ApiProperty({ example: new Date() })
  updatedAt: Date
}

export class VehicleFuelConsumptionView {
  constructor(data: Prisma.FuelConsumptionGetPayload<{}>) {
    this.id = data.id
    this.vehicleId = data.vehicleId
    this.startFuelingId = data.startFuelingId
    this.endFuelingId = data.endFuelingId
    this.distanceKm = Number(data.distanceKm)
    this.litersConsumed = Number(data.litersConsumed)
    this.averageKmPerLiter = Number(data.averageKmPerLiter)
    this.createdAt = new Date(data.createdAt)
  }

  @ApiProperty({ example: 'ea951cd1-31ce-42a5-8056-466db3431e63' })
  id: string

  @ApiProperty({ example: 'ea951cd1-31ce-42a5-8056-466db3431e63' })
  vehicleId: string

  @ApiProperty({ example: 'ea951cd1-31ce-42a5-8056-466db3431e63' })
  startFuelingId: string

  @ApiProperty({ example: 'ea951cd1-31ce-42a5-8056-466db3431e63' })
  endFuelingId: string

  @ApiProperty({ example: 500 })
  distanceKm: number

  @ApiProperty({ example: 50 })
  litersConsumed: number

  @ApiProperty({ example: 10 })
  averageKmPerLiter: number

  @ApiProperty({ example: new Date() })
  createdAt: Date
}

export class VehicleDetailedView extends VehicleView {
  constructor(data: IVehicleView & {
    Fuelings: Prisma.FuelingGetPayload<{}>[]
    FuelConsumptions: Prisma.FuelConsumptionGetPayload<{}>[]
  }) {
    super(data)
    this.Fuelings = data.Fuelings.map(fueling => new VehicleFuelingView(fueling))
    this.FuelConsumptions = data.FuelConsumptions.map(consumption => new VehicleFuelConsumptionView(consumption))
  }

  static fromPrisma(vehicle: Prisma.VehicleGetPayload<{
    include: {
      Fuelings: true,
      FuelConsumptions: true
    }
  }>): VehicleDetailedView {

    return new VehicleDetailedView({
      ...VehicleView.fromPrisma(vehicle),
      Fuelings: vehicle.Fuelings,
      FuelConsumptions: vehicle.FuelConsumptions
    })
  }

  @ApiProperty({ example: [], type: [VehicleFuelingView] })
  Fuelings: VehicleFuelingView[]

  @ApiProperty({ example: [], type: [VehicleFuelConsumptionView] })
  FuelConsumptions: VehicleFuelConsumptionView[]
}
