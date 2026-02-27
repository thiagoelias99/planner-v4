import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { Roles } from "@thallesp/nestjs-better-auth"

@Controller('notifications')
@Roles(["admin"])
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get('status')
  async getQueueStatus() {
    return await this.notificationsService.getQueueStatus()
  }

  @Get('jobs')
  async getJobs() {
    return await this.notificationsService.getJobs()
  }

  @Delete('jobs/:id')
  async cancelJob(@Param('id') id: string) {
    return await this.notificationsService.cancelJob(id)
  }

  @Post('jobs/:id/execute')
  async executeJob(@Param('id') id: string) {
    return await this.notificationsService.executeJob(id)
  }

  @Patch('pause')
  async pauseQueue() {
    await this.notificationsService.pauseQueue()
  }

  @Patch('resume')
  async resumeQueue() {
    await this.notificationsService.resumeQueue()
  }
}
