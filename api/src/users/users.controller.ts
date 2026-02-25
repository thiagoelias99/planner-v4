import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import { UserModel } from "../generated/prisma/models"
import { CreateUserInput } from "./dto/create-user.input"
import { ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { PaginatedUserView } from "./dto/paginated-users.view"
import { OptionalAuth, Session, type UserSession } from "@thallesp/nestjs-better-auth"

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
    return this.usersService.createUser(input)
  }

  @Get()
  async getUsers(): Promise<PaginatedUserView> {
    return this.usersService.users({})
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
