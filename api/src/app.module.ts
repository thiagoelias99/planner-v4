import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './users/users.module'
import { PostsModule } from './posts/posts.module'
import { ConfigModule } from "@nestjs/config"
import { HealthModule } from './health/health.module'
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"
import { APP_GUARD } from "@nestjs/core"
import { auth } from "./utils/auth"
import { AuthModule } from "@thallesp/nestjs-better-auth"
import { AuthModule as AppAuthModule } from './auth/auth.module'
import { ScheduleModule } from "@nestjs/schedule"
import { CronService } from "./cron.service"

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
          limit: 100,
          blockDuration: 10000  // 10 seconds
        },
        {
          name: 'medium',
          ttl: 10 * 1000, // 10 seconds
          limit: 20,
          blockDuration: 5 * 1000 // 5 seconds
        },
        {
          name: 'short',
          ttl: 1 * 1000, // 1 second
          limit: 3,
          blockDuration: 1 * 1000 // 1 second
        }
      ]
    }),
    AuthModule.forRoot({ auth, enableRawBodyParser: true, }),
    ScheduleModule.forRoot(),
    PrismaModule,
    UsersModule,
    PostsModule,
    HealthModule,
    AppAuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CronService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  ],
})
export class AppModule { }
