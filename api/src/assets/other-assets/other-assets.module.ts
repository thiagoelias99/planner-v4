import { Module } from '@nestjs/common'
import { OtherAssetsService } from './other-assets.service'
import { OtherAssetsController } from './other-assets.controller'
import { PrismaModule } from "../../prisma/prisma.module"

@Module({
  imports: [PrismaModule],
  controllers: [OtherAssetsController],
  providers: [OtherAssetsService],
})
export class OtherAssetsModule { }
