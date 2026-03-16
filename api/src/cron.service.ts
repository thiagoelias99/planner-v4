import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { NotificationsService } from "./notifications/notifications.service"
import { DashboardService } from "./dashboard/dashboard.service"

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly dashboardService: DashboardService
    // private readonly notificationsService: NotificationsService
  ) { }

  @Cron('0 2 1 * *', {
    name: 'portfolio-snapshot-first-day',
    timeZone: 'America/Sao_Paulo'
  })
  async handlePortfolioSnapshotFirstDay() {
    this.logger.log('Running portfolio snapshot for the 1st of the month')
    try {
      const result = await this.dashboardService.createAllUsersSnapshot()
      this.logger.log(`Portfolio snapshot completed: ${result.successful} successful, ${result.failed} failed`)
    } catch (error) {
      const err = error as Error
      this.logger.error(`Portfolio snapshot failed: ${err.message}`, err.stack)
    }
  }

  @Cron('0 2 15 * *', {
    name: 'portfolio-snapshot-fifteenth-day',
    timeZone: 'America/Sao_Paulo'
  })
  async handlePortfolioSnapshotFifteenthDay() {
    this.logger.log('Running portfolio snapshot for the 15th of the month')
    try {
      const result = await this.dashboardService.createAllUsersSnapshot()
      this.logger.log(`Portfolio snapshot completed: ${result.successful} successful, ${result.failed} failed`)
    } catch (error) {
      const err = error as Error
      this.logger.error(`Portfolio snapshot failed: ${err.message}`, err.stack)
    }
  }
}
