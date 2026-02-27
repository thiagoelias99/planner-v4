import { InjectQueue } from "@nestjs/bullmq"
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from "bullmq"
import { DateService } from "../utils/date"
import { NotificationProcessor } from "./notification.processor"

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notification') private notificationQueue: Queue,
    private notificationProcessor: NotificationProcessor
  ) { }

  private readonly logger = new Logger(NotificationsService.name);
  private readonly dateService = new DateService()

  async newEmailNotification(email: string, subject: string, message: string) {
    this.logger.debug(`Adding new email notification to queue: ${email}, ${subject}`)
    await this.notificationQueue.add('email', {
      email,
      subject,
      message,
      timestamp: this.dateService.nowUtc()
    })
  }

  async pauseQueue() {
    this.logger.debug('Pausing notification queue')
    await this.notificationQueue.pause()
  }

  async resumeQueue() {
    this.logger.debug('Resuming notification queue')
    await this.notificationQueue.resume()
  }

  async getJobs(status?: string) {
    this.logger.debug(`Getting jobs from notification queue with status: ${status || 'all'}`)

    const validStatuses = ['waiting', 'active', 'completed', 'failed', 'delayed', 'paused']

    if (status && !validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Valid statuses: ${validStatuses.join(', ')}`)
    }

    if (status) {
      return await this.notificationQueue.getJobs(status as any)
    }

    // Get all jobs from different states
    const [waiting, active, completed, failed, delayed, paused, all] = await Promise.all([
      this.notificationQueue.getJobs('waiting'),
      this.notificationQueue.getJobs('active'),
      this.notificationQueue.getJobs('completed'),
      this.notificationQueue.getJobs('failed'),
      this.notificationQueue.getJobs('delayed'),
      this.notificationQueue.getJobs('paused'),
      this.notificationQueue.getJobs()
    ])

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      paused,
      all,
      total: waiting.length + active.length + completed.length + failed.length + delayed.length + paused.length
    }
  }

  async cancelJob(jobId: string) {
    this.logger.debug(`Canceling job ${jobId}`)
    const job = await this.notificationQueue.getJob(jobId)

    if (!job) {
      throw new Error(`Job ${jobId} not found`)
    }

    await job.remove()
    return { message: `Job ${jobId} canceled successfully` }
  }

  async executeJob(jobId: string) {
    this.logger.debug(`Manually executing job ${jobId}`)
    const job = await this.notificationQueue.getJob(jobId)

    if (!job) {
      throw new Error(`Job ${jobId} not found`)
    }

    try {
      // Process the job directly, bypassing the queue system
      // This works even if the queue is paused
      await this.notificationProcessor.process(job)

      // Mark the job as completed
      await job.moveToCompleted('Manual execution completed', job.token || '0', true)

      return {
        message: `Job ${jobId} executed successfully`,
        jobId: job.id,
        jobName: job.name,
        jobData: job.data
      }
    } catch (error) {
      // Mark the job as failed if processing throws an error
      const errorObj = error instanceof Error ? error : new Error(String(error))
      await job.moveToFailed(errorObj, job.token || '0', true)
      throw new Error(`Failed to execute job ${jobId}: ${errorObj.message}`)
    }
  }

  async getQueueStatus() {
    this.logger.debug('Getting queue status')

    // Get job counts for each state
    const [waitingCount, activeCount, completedCount, failedCount, delayedCount] = await Promise.all([
      this.notificationQueue.getWaitingCount(),
      this.notificationQueue.getActiveCount(),
      this.notificationQueue.getCompletedCount(),
      this.notificationQueue.getFailedCount(),
      this.notificationQueue.getDelayedCount()
    ])

    // Check if queue is paused
    const isPaused = await this.notificationQueue.isPaused()

    // Get workers information
    const workers = await this.notificationQueue.getWorkers()

    return {
      name: this.notificationQueue.name,
      isPaused,
      jobCounts: {
        waiting: waitingCount,
        active: activeCount,
        completed: completedCount,
        failed: failedCount,
        delayed: delayedCount,
        total: waitingCount + activeCount + delayedCount
      },
      workers: {
        count: workers.length,
        details: workers
      },
      timestamp: this.dateService.nowUtc()
    }
  }
}
