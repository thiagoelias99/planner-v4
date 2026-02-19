
import { Injectable } from '@nestjs/common'
import { PrismaService } from "../prisma/prisma.service"
import { Prisma, User } from "../generated/prisma/client"
import { PaginatedUserView } from "./dto/paginated-users.view"
import { prismaUserToUserView } from "./utils"

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    })
  }

  async users(params: {
    skip?: number
    take?: number
    cursor?: Prisma.UserWhereUniqueInput
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<PaginatedUserView> {
    const { skip, take, where, orderBy } = params
    const users = await this.prisma.user.findMany({
      skip,
      take,
      where,
      orderBy,
    })

    const total = await this.prisma.user.count({ where })


    return new PaginatedUserView({
      page: skip && take ? Math.floor(skip / take) + 1 : 1,
      limit: take || users.length,
      total,
      users: users.map(prismaUserToUserView),
    })
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    })
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }): Promise<User> {
    const { where, data } = params
    return this.prisma.user.update({
      data,
      where,
    })
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    })
  }
}
