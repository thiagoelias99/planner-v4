import { BadRequestException, Body, Controller, Get, HttpCode, NotImplementedException, Param, Post, Put, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserInput } from "./dto/create-user.input"
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { PaginatedUserView } from "./dto/paginated-users.view"
import { Roles, Session, type UserSession } from "@thallesp/nestjs-better-auth"
import { EUserRole } from "./utils/user-role"
import { UsersView } from "./dto/users.view"
import { prismaUserToUserView } from "./utils"
import { QueryUserInput } from "./dto/query-user.input"
import { UpdateUserInput } from "./dto/update-user.input"

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @HttpCode(201)
  @Roles([EUserRole.ADMIN])
  @ApiCreatedResponse({ type: UsersView })
  async createUser(
    @Body() input: CreateUserInput,
  ): Promise<UsersView> {
    const user = await this.usersService.create(input)
    return new UsersView(prismaUserToUserView(user))
  }

  @Post(':id/reset-password')
  @HttpCode(204)
  @Roles([EUserRole.ADMIN])
  @ApiNoContentResponse()
  async resetPassword(@Param('id') id: string, @Query("redirectTo") redirectTo: string): Promise<void> {
    await this.usersService.resetPassword({ id, redirectTo })
    return
  }

  @Get()
  @Roles([EUserRole.ADMIN])
  @ApiOkResponse({ type: PaginatedUserView })
  async findAll(
    @Query() query: QueryUserInput
  ): Promise<PaginatedUserView> {
    const users = await this.usersService.users(query)

    return new PaginatedUserView({
      page: query.page || 1,
      limit: query.limit || 10,
      total: users.total,
      users: users.users.map(u => new UsersView(prismaUserToUserView(u)))
    })
  }

  @Get("me")
  @ApiOkResponse({ type: UsersView })
  async getProfile(@Session() session: UserSession) {
    if (!session) {
      return { message: "No session found" }
    }
    const user = await this.usersService.user({ id: session.session.userId })

    if (!user) {
      throw new BadRequestException("User not found")
    }

    return new UsersView(prismaUserToUserView(user))
  }

  @Get(':id')
  @ApiOkResponse({ type: UsersView })
  @Roles([EUserRole.ADMIN])
  async getUser(@Param('id') id: string): Promise<UsersView> {
    const user = await this.usersService.user({ id })

    if (!user) {
      throw new BadRequestException("User not found")
    }

    return new UsersView(prismaUserToUserView(user))
  }

  @Put(':id')
  @ApiOkResponse({ type: UsersView })
  @Roles([EUserRole.ADMIN])
  async updateUser(@Param('id') id: string, @Body() input: UpdateUserInput): Promise<UsersView> {
    const users = await this.usersService.updateUser({ where: { id }, data: input })

    if (!users) {
      throw new BadRequestException("User not found")
    }

    return new UsersView(prismaUserToUserView(users))
  }
}
