import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { DashboardService } from "./dashboard/dashboard.service"
import { BudgetsService } from "./budgets/budgets.service"
import { UsersService } from "./users/users.service"

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly budgetsService: BudgetsService,
    private readonly usersService: UsersService,
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

  @Cron('2 2 1 * *', {
    name: 'portfolio-snapshot-first-day',
    timeZone: 'America/Sao_Paulo'
  })
  async createMonthlyTransactions() {
    this.logger.log('Running monthly transactions creation for the 1st of the month')
    try {
      const users = await this.usersService.users()
      for (const user of users.users) {
        await this.budgetsService.createMissingMonthlyTransactionItemsForCurrentMonth(user.id)
        this.logger.log(`Monthly transactions created for user ${user.email} (${user.id})`)
      }

      this.logger.log('Monthly transactions creation completed successfully')
    } catch (error) {
      const err = error as Error
      this.logger.error(`Monthly transactions creation failed: ${err.message}`, err.stack)
    }
  }
}
