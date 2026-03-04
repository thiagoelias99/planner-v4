export interface IUser {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string
  createdAt: Date
  updatedAt: Date
  role: string
  banned: boolean
  banReason: string
  banExpiresAt: Date
}
