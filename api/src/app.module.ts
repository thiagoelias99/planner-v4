import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './users/users.module'
import { ConfigModule } from "@nestjs/config"
import { HealthModule } from './health/health.module'
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"
import { ScheduleModule } from "@nestjs/schedule"
import { APP_GUARD } from "@nestjs/core"
import { auth } from "./utils/auth"
import { AuthModule } from "@thallesp/nestjs-better-auth"
import { AuthModule as AppAuthModule } from './auth/auth.module'
import { CronService } from "./cron.service"
import { AppApiKeyController } from "./app.api.controller"
import { ApiKeyGuard } from "./guards/api-key.guard"
import { TickersModule } from './assets/tickers/tickers.module'
import { TickerOrdersModule } from './assets/ticker-orders/ticker-orders.module'
import { FixedIncomesModule } from './assets/fixed-incomes/fixed-incomes.module'
import { OtherAssetsModule } from './assets/other-assets/other-assets.module'
import { AssetBalanceStrategyModule } from './assets/asset-balance-strategy/asset-balance-strategy.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'long',
          ttl: 60 * 1000, // 60 seconds
          limit: process.env.NODE_ENV === 'production' ? 100 : 120,
          blockDuration: 10000  // 10 seconds
        },
        {
          name: 'medium',
          ttl: 10 * 1000, // 10 seconds
          limit: process.env.NODE_ENV === 'production' ? 20 : 40,
          blockDuration: 5 * 1000 // 5 seconds
        },
        {
          name: 'short',
          ttl: 1 * 1000, // 1 second
          limit: process.env.NODE_ENV === 'production' ? 6 : 20,
          blockDuration: 1 * 1000 // 1 second
        }
      ]
    }),
    AuthModule.forRoot({ auth, enableRawBodyParser: true, }),
    ScheduleModule.forRoot(),
    // BullModule.forRoot({
    //   connection: {
    //     host: process.env.REDIS_HOST,
    //     port: Number(process.env.REDIS_PORT),
    //     ...(process.env.REDIS_USERNAME && { username: process.env.REDIS_USERNAME }),
    //     ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
    //   },
    //   prefix: 'plannerv4'
    // }),
    PrismaModule,
    UsersModule,
    HealthModule,
    AppAuthModule,
    // NotificationsModule,
    TickersModule,
    TickerOrdersModule,
    FixedIncomesModule,
    OtherAssetsModule,
    AssetBalanceStrategyModule
  ],
  controllers: [AppController, AppApiKeyController],
  providers: [
    AppService,
    CronService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  ],
})
export class AppModule { }
