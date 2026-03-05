export enum EUserRole {
  ADMIN = "admin",
  USER = "user"
}

export interface IUser {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string
  createdAt: Date
  updatedAt: Date
  role: EUserRole
  banned?: boolean
  banReason?: string
  banExpiresAt?: Date
}
