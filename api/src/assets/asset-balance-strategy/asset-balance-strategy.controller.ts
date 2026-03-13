import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AssetBalanceStrategyService } from './asset-balance-strategy.service';
import { UpdateAssetBalanceStrategyInput } from './dto/update-asset-balance-strategy.input';
import { AssetBalanceStrategyView } from './dto/asset-balance-strategy.view';
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

@ApiTags('Asset Balance Strategy')
@ApiBearerAuth()
@Controller('asset-balance-strategy')
export class AssetBalanceStrategyController {
  constructor(private readonly assetBalanceStrategyService: AssetBalanceStrategyService) { }

  @Get()
  @ApiOperation({ summary: 'Get current user asset balance strategy' })
  @ApiResponse({ status: 200, description: 'Return the current asset balance strategy.', type: AssetBalanceStrategyView })
  async getStrategy(@Session() session: UserSession): Promise<AssetBalanceStrategyView> {
    return this.assetBalanceStrategyService.getStrategy(session.user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Update user asset balance strategy' })
  @ApiResponse({ status: 200, description: 'The strategy has been successfully updated.', type: AssetBalanceStrategyView })
  @ApiResponse({ status: 400, description: 'Bad Request. Sum must be exactly 100%.' })
  async updateStrategy(
    @Session() session: UserSession,
    @Body() updateAssetBalanceStrategyInput: UpdateAssetBalanceStrategyInput,
  ): Promise<AssetBalanceStrategyView> {
    return this.assetBalanceStrategyService.updateStrategy(session.user.id, updateAssetBalanceStrategyInput);
  }
}
