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

  accounts?: IUserAccountsView[]
}

export interface IUserAccountsView {
  id: string
  providerId: string
  createdAt: Date
  updatedAt: Date
}

export class UserAccountsView implements IUserAccountsView {
  constructor(data: IUserAccountsView) {
    this.id = data.id
    this.providerId = data.providerId
    this.createdAt = new Date(data.createdAt)
    this.updatedAt = new Date(data.updatedAt)
  }

  @ApiProperty()
  id: string

  @ApiProperty()
  providerId: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

export class UsersView implements IUserView {
  constructor(data: IUserView) {
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.emailVerified = data.emailVerified
    this.image = data.image
    this.role = data.role
    this.banned = data.banned
    this.banReason = data.banReason

    this.createdAt = new Date(data.createdAt)
    this.updatedAt = new Date(data.updatedAt)

    if (data.banExpires) {
      this.banExpiresAt = new Date(data.banExpires)
    }

    if (data.accounts) {
      this.accounts = data.accounts.map(a => new UserAccountsView(a))
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

  @ApiPropertyOptional({ type: [UserAccountsView] })
  accounts?: UserAccountsView[]
}