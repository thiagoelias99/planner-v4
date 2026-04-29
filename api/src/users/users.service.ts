
import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from "../prisma/prisma.service"
import { Prisma, User } from "../generated/prisma/client"
import { PaginatedUserView } from "./dto/paginated-users.view"
import { prismaUserToUserView } from "./utils"
import { CustomLogger } from "../utils/logger"
import { CreateUserInput } from "./dto/create-user.input"
import { auth } from "../utils/auth"
import { QueryUserInput } from "./dto/query-user.input"

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  private readonly logger = new CustomLogger(UsersService.name);

  async create(input: CreateUserInput): Promise<Prisma.UserGetPayload<{ include: { accounts: true } }>> {
    await auth.api.signUpEmail({
      returnHeaders: true,
      body: {
        email: input.email,
        password: input.password,
        name: input.name
      }
    })

    const user = await this.user({ email: input.email })

    if (!user) {
      this.logger.error(`User with email ${input.email} was not found after registration.`)
      throw new Error('User creation failed')
    }

    return user
  }

  async user(where: Prisma.UserWhereUniqueInput): Promise<Prisma.UserGetPayload<{ include: { accounts: true } }> | null> {
    return this.prisma.user.findUnique({
      where,
      include: {
        accounts: true
      }
    })
  }

  async users(query?: QueryUserInput): Promise<{ users: Prisma.UserGetPayload<{ include: { accounts: true } }>[], total: number }> {
    const { page = 1, limit = 10, orderBy = 'name', order = 'asc', search, role } = query || {}

    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.UserWhereInput = {}

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (role) {
      where.role = role
    }

    // Build orderBy clause
    const orderByClause: Prisma.UserOrderByWithRelationInput = {
      [orderBy]: order
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
        where,
        orderBy: orderByClause,
        include: { accounts: true }
      }),
      this.prisma.user.count({ where }),
    ])

    return { users, total }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }): Promise<Prisma.UserGetPayload<{ include: { accounts: true } }> | null> {
    const { where, data } = params
    await this.prisma.user.update({
      data,
      where,
    })

    return this.user(where)
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<void> {
    await this.prisma.user.delete({
      where,
    })

    return
  }

  async resetPassword({ id, redirectTo }: { id: string, redirectTo: string }): Promise<void> {
    const user = await this.user({ id })

    if (!user) {
      throw new BadRequestException("User not found")
    }

    await auth.api.requestPasswordReset({
      body: {
        email: user.email,
        redirectTo
      }
    })
  }
}
