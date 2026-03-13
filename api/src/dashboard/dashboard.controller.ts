import { Controller, Get, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger'
import { Session, type UserSession } from "@thallesp/nestjs-better-auth"
import { DashboardService } from "./dashboard.service"

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('summary')
  @ApiOperation({ summary: 'Get user dashboard summary' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Dashboard summary returned successfully' })
  async getSummary(@Session() session: UserSession) {
    return this.dashboardService.getSummary(session.user.id)
  }
}
