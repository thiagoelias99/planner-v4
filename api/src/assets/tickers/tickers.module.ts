import { Module } from '@nestjs/common';
import { TickersService } from './tickers.service';
import { TickersController } from './tickers.controller';

@Module({
  controllers: [TickersController],
  providers: [TickersService],
})
export class TickersModule {}
