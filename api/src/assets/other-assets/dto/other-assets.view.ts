import { ApiProperty } from "@nestjs/swagger"

export enum EOtherAssetType {
  CASH_BOX = 'CASH_BOX',
  PENSION = 'PENSION',
  PROPERTY = 'PROPERTY',
  OTHER = 'OTHER'
}

export interface IOtherAssetView {
  id: string
  userId: string
  description: string
  agency: string | null
  note: string | null
  value: number
  type: EOtherAssetType
  createdAt: Date
  updatedAt: Date
}

export class OtherAssetView implements IOtherAssetView {
  constructor(data: IOtherAssetView) {
    Object.assign(this, data)

    this.createdAt = new Date(data.createdAt)
    this.updatedAt = new Date(data.updatedAt)
  }

  @ApiProperty({ example: 'clxyz1234567890' })
  id: string

  @ApiProperty({ example: 'user123' })
  userId: string

  @ApiProperty({ example: 'Savings Account' })
  description: string

  @ApiProperty({ example: 'Banco XYZ', nullable: true })
  agency: string | null

  @ApiProperty({ example: 'Emergency fund', nullable: true })
  note: string | null

  @ApiProperty({ example: 10000.00 })
  value: number

  @ApiProperty({ example: EOtherAssetType.CASH_BOX, enum: EOtherAssetType })
  type: EOtherAssetType

  @ApiProperty({ example: new Date() })
  createdAt: Date

  @ApiProperty({ example: new Date() })
  updatedAt: Date
}

export class PaginatedOtherAssetView {
  constructor(data: {
    page: number
    limit: number
    total: number
    otherAssets: OtherAssetView[]
  }) {
    this.page = data.page
    this.limit = data.limit
    this.total = data.total
    this.totalPages = Math.ceil(data.total / data.limit)
    this.data = data.otherAssets
  }

  @ApiProperty({ description: "Current page number", example: 1 })
  page: number

  @ApiProperty({ description: "Number of items per page", example: 10 })
  limit: number

  @ApiProperty({ description: "Total number of items", example: 100 })
  total: number

  @ApiProperty({ description: "Total number of pages", example: 10 })
  totalPages: number

  @ApiProperty({ description: "List of other assets for the current page", type: [OtherAssetView] })
  data: OtherAssetView[]
}
