import { Body, Controller, Get, HttpCode, NotImplementedException, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import { UserModel } from "../generated/prisma/models"
import { CreateUserInput } from "./dto/create-user.input"
import { ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { PaginatedUserView } from "./dto/paginated-users.view"
import { OptionalAuth, Roles, Session, type UserSession } from "@thallesp/nestjs-better-auth"
import { EUserRole } from "./utils/user-role"

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @HttpCode(201)
  @ApiOkResponse()
  async signupUser(
    @Body() input: CreateUserInput,
  ): Promise<UserModel> {
    throw new NotImplementedException()
  }

  @Get()
  @Roles([EUserRole.ADMIN])
  async getUsers(): Promise<PaginatedUserView> {
    throw new NotImplementedException()
  }

  @Get("me")
  @OptionalAuth()
  async getProfile(@Session() session: UserSession) {
    if (!session) {
      return { message: "No session found" }
    }
    return session
  }
}
