import { User } from "../../generated/prisma/client"
import { UsersView } from "../dto/users.view"

export function prismaUserToUserView(user: User): UsersView {
  return new UsersView({
    id: user.id,
    name: user.name,
    email: user.email,
  })
}