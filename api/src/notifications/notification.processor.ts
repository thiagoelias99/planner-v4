
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { AllowAnonymous } from "@thallesp/nestjs-better-auth"

@ApiTags('Notifications')
@AllowAnonymous()
@Processor('notification')
export class NotificationProcessor extends WorkerHost {

  private readonly logger = new Logger(NotificationProcessor.name);

  async process(job: any) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name} with data: ${JSON.stringify(job.data)}`)

    switch (job.name) {
      case 'email':
        this.logger.debug(`Sending email to ${job.data.email} with subject "${job.data.subject}" and message "${job.data.message}"`)
        await new Promise(resolve => setTimeout(resolve, 4000))
        break
      default:
        this.logger.warn(`Unknown job type: ${job.name}`)
    }
  }
}
