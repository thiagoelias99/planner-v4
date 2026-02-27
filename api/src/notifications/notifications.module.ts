import { Global, Module } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { NotificationsController } from './notifications.controller'
import { BullModule } from "@nestjs/bullmq"
import { NotificationProcessor } from "./notification.processor"

@Global()
@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'notification' }
    ),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationProcessor],
  exports: [NotificationsService]
})
export class NotificationsModule { }
