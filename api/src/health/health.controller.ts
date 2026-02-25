
import { Controller, Get } from '@nestjs/common'
import { HealthCheckService, HealthCheck, PrismaHealthIndicator, DiskHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus'
import { PrismaService } from "../prisma/prisma.service"
import { AllowAnonymous } from "@thallesp/nestjs-better-auth"

@Controller('health')
@AllowAnonymous()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private db: PrismaHealthIndicator
  ) { }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.85 }),
      () => this.memory.checkHeap('memory_heap', 256 * 1024 * 1024),
      () => this.db.pingCheck('database', PrismaService.getInstance())
    ])
  }
}