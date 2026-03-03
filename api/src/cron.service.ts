import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { NotificationsService } from "./notifications/notifications.service"

@Injectable()
export class CronService {
  constructor(
    private readonly notificationsService: NotificationsService
  ) { }

  private readonly logger = new Logger(CronService.name);
}
