import { Body, Controller, Get, HttpCode, NotImplementedException, Param, Post, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserInput } from "./dto/create-user.input"
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { PaginatedUserView } from "./dto/paginated-users.view"
import { Roles, Session, type UserSession } from "@thallesp/nestjs-better-auth"
import { EUserRole } from "./utils/user-role"
import { UsersView } from "./dto/users.view"
import { prismaUserToUserView } from "./utils"
import { QueryUserInput } from "./dto/query-user.input"

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
  async getProfile(@Session() session: UserSession) {
    if (!session) {
      return { message: "No session found" }
    }
    return this.usersService.user({ id: session.session.userId })
  }

  @Get(':id')
  @Roles([EUserRole.ADMIN])
  async getUser(@Param('id') id: string): Promise<UsersView> {
    throw new NotImplementedException()
  }

  @Get(':id')
  @Roles([EUserRole.ADMIN])
  async getUser(@Param('id') id: string): Promise<UsersView> {
    throw new NotImplementedException()
  }
}
