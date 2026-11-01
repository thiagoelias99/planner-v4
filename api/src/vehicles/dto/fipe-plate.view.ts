import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Vehicle } from "../../generated/prisma/client"

export interface IFipePlateView {
  plate: string
  brand: string
  model: string
  year: string
  color: string
  power: string
  fuel: string
  chassis: string
  state: string
  city: string
  imported: boolean
  segment: string
  fipePrices: FipePrice[]
}

export interface FipePrice {
  codeFipe: string
  model: string
  price: string
}

export class FipePriceView implements FipePrice {
  constructor(data: FipePrice) {
    this.codeFipe = data.codeFipe
    this.model = data.model
    this.price = data.price
  }

  @ApiProperty({ example: '1234' })
  codeFipe: string

  @ApiProperty({ example: 'Corolla' })
  model: string

  @ApiProperty({ example: '50000' })
  price: string
}

export class FipePlateView implements IFipePlateView {
  constructor(data: IFipePlateView) {
    this.plate = data.plate
    this.brand = data.brand
    this.model = data.model
    this.year = data.year
    this.color = data.color
    this.power = data.power
    this.fuel = data.fuel
    this.chassis = data.chassis
    this.state = data.state
    this.city = data.city
    this.imported = data.imported
    this.segment = data.segment
    this.fipePrices = data.fipePrices.map(fp => new FipePriceView(fp))
  }

  @ApiProperty({ example: 'ABC-1234' })
  plate: string

  @ApiProperty({ example: 'Toyota' })
  brand: string

  @ApiProperty({ example: 'Corolla' })
  model: string

  @ApiProperty({ example: '2020' })
  year: string

  @ApiProperty({ example: 'Red' })
  color: string

  @ApiProperty({ example: '150' })
  power: string

  @ApiProperty({ example: 'Gasoline' })
  fuel: string

  @ApiProperty({ example: 'ABC123456789' })
  chassis: string

  @ApiProperty({ example: 'SP' })
  state: string

  @ApiProperty({ example: 'São Paulo' })
  city: string

  @ApiProperty({ example: false })
  imported: boolean

  @ApiProperty({ example: 'Sedan' })
  segment: string

  @ApiProperty({ type: [FipePriceView] })
  fipePrices: FipePriceView[]
}