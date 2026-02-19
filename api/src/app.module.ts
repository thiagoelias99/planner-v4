import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './users/users.module'
import { PostsModule } from './posts/posts.module'
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    UsersModule,
    PostsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
