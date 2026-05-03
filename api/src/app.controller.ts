import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiTags } from "@nestjs/swagger"
import { AllowAnonymous } from "@thallesp/nestjs-better-auth"

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @Get("sse")
  // @AllowAnonymous()
  // getHello(): string {
  //   return "Hello"
  // }
}
