export enum EUserRole {
  ADMIN = "admin",
  USER = "user"
}

interface EUserRoleMapperType {
  label: string,
  variant: "default" | "secondary" | "destructive" | "outline"
}

export const eUserRoleMapper: Record<EUserRole, EUserRoleMapperType> = {
  [EUserRole.ADMIN]: { label: "Admin", variant: "default" },
  [EUserRole.USER]: { label: "Usuário", variant: "secondary" },
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
