import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { NotificationsService } from "./notifications/notifications.service"

@Injectable()
export class CronService {
  constructor(
    private readonly notificationsService: NotificationsService
  ) { }

  private readonly logger = new Logger(CronService.name);

  @Cron('30 21 * * *', { timeZone: 'America/Sao_Paulo' })
  handleCron() {
    this.logger.debug('Called every day at 21:30 America/Sao_Paulo')
  }

  @Cron(CronExpression.EVERY_MINUTE, { timeZone: 'America/Sao_Paulo' })
  handleSendEmailNotification() {
    this.logger.debug('Cron job called every minute to send email notification')
    this.notificationsService.newEmailNotification(
      'example@example.com',
      'Subject 123',
      'Message 123'
    )
  }
}
