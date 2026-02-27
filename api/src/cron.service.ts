import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  @Cron('34 21 * * *', { timeZone: 'America/Sao_Paulo' })
  handleCron() {
    this.logger.debug('Called every day at 21:34 America/Sao_Paulo')
  }
}
