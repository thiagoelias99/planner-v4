import { Controller, Get, HttpCode, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { AllowAnonymous } from "@thallesp/nestjs-better-auth"
import { CronService } from "./cron.service"

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cronService: CronService
  ) { }

  @AllowAnonymous()
  @Post("trigger-monthly-transactions")
  @HttpCode(200)
  @ApiOperation({ summary: "Manual trigger of monthly transactions" })
  triggerMonthlyTransactions() {
    return this.cronService.createMonthlyTransactions()
  }
}
