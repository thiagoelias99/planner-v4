import { User } from "../../generated/prisma/client"
import { UsersView } from "../dto/users.view"
import { EUserRole } from "./user-role"

export function prismaUserToUserView(user: User): UsersView {
  return new UsersView({
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image || undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: (user.role as EUserRole) || undefined,
    banned: user.banned || undefined,
    banReason: user.banReason || undefined,
    banExpires: user.banExpires || undefined
  })
}