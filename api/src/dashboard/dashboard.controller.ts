import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger'
import { Session, Roles, type UserSession } from "@thallesp/nestjs-better-auth"
import { DashboardService } from "./dashboard.service"
import { EUserRole } from "../users/utils/user-role"
import { DashboardSummaryView } from "./dto/dashboard-summary.view"

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('summary')
  @ApiOperation({ summary: 'Get user dashboard summary with last 24 portfolio history snapshots' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: DashboardSummaryView, description: 'Dashboard summary with history returned successfully' })
  async getSummary(@Session() session: UserSession): Promise<DashboardSummaryView> {
    return this.dashboardService.getSummary(session.user.id)
  }

  @Post('admin/create-history-snapshot')
  @Roles([EUserRole.ADMIN])
  @ApiOperation({ summary: 'Create portfolio history snapshot for all users (admin only)' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Portfolio history snapshots created successfully' })
  async createHistorySnapshot() {
    return this.dashboardService.createAllUsersSnapshot()
  }
}
