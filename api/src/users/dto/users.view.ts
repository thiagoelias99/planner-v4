import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { EUserRole } from "../utils/user-role"

export interface IUserView {
  id: string
  name: string
  email: string
  emailVerified?: boolean
  image?: string
  createdAt: Date
  updatedAt: Date

  role?: EUserRole
  banned?: boolean
  banReason?: string
  banExpires?: Date
}

export class UsersView implements IUserView {
  constructor(data: IUserView) {
    Object.assign(this, data)

    this.createdAt = new Date(data.createdAt)
    this.updatedAt = new Date(data.updatedAt)

    if (data.banExpires) {
      this.banExpiresAt = new Date(data.banExpires)
    }
  }

  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string

  @ApiPropertyOptional()
  emailVerified?: boolean

  @ApiPropertyOptional()
  image?: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiPropertyOptional({ enum: EUserRole })
  role?: EUserRole

  @ApiPropertyOptional()
  banned?: boolean

  @ApiPropertyOptional()
  banReason?: string

  @ApiPropertyOptional()
  banExpiresAt?: Date
}