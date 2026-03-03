import { Controller, Get, NotImplementedException } from '@nestjs/common'
import { ApiHeader, ApiTags } from "@nestjs/swagger"
import { PaginatedUserView } from "./users/dto/paginated-users.view"
import { AllowAnonymous } from "@thallesp/nestjs-better-auth"
import { ApiKey } from "./guards/api-key.decorator"

@ApiTags('ApiKey')
@Controller('api-key')
@ApiKey()
@AllowAnonymous()
@ApiHeader({ name: 'x-api-key', description: 'API key for authentication' })
export class AppApiKeyController {

  @Get('users')
  async getUsers(): Promise<PaginatedUserView> {
    throw new NotImplementedException()
  }
}
