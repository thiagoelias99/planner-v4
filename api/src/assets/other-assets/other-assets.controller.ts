import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common'
import { OtherAssetsService } from './other-assets.service'
import { OtherAssetView, PaginatedOtherAssetView } from "./dto/other-assets.view"
import { prismaOtherAssetToOtherAssetView } from "./utils"
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { CreateOtherAssetInput } from "./dto/create-other-asset.input"
import { UpdateOtherAssetInput } from "./dto/update-other-asset.input"
import { QueryOtherAssetInput } from "./dto/query-other-asset.input"
import { Session, type UserSession } from "@thallesp/nestjs-better-auth"

@ApiTags('Other Assets')
@Controller('other-assets')
export class OtherAssetsController {
  constructor(private readonly otherAssetsService: OtherAssetsService) { }

  @Post()
  @ApiCreatedResponse({ type: OtherAssetView, description: 'Other asset created successfully' })
  async create(
    @Session() session: UserSession,
    @Body() createOtherAssetDto: CreateOtherAssetInput
  ): Promise<OtherAssetView> {
    const otherAsset = await this.otherAssetsService.create(session.user.id, createOtherAssetDto)
    return new OtherAssetView(prismaOtherAssetToOtherAssetView(otherAsset))
  }

  @Get()
  @ApiOkResponse({ type: PaginatedOtherAssetView, description: 'List of other assets' })
  async findAll(
    @Session() session: UserSession,
    @Query() query: QueryOtherAssetInput
  ): Promise<PaginatedOtherAssetView> {
    const result = await this.otherAssetsService.findAll(session.user.id, query)

    return new PaginatedOtherAssetView({
      page: query.page || 1,
      limit: query.limit || 10,
      total: result.total,
      otherAssets: result.otherAssets.map(a => new OtherAssetView(prismaOtherAssetToOtherAssetView(a)))
    })
  }

  @Get(':id')
  @ApiOkResponse({ type: OtherAssetView, description: 'Other asset details' })
  async findOne(
    @Session() session: UserSession,
    @Param('id') id: string
  ): Promise<OtherAssetView> {
    const otherAsset = await this.otherAssetsService.findOne(session.user.id, id)
    return new OtherAssetView(prismaOtherAssetToOtherAssetView(otherAsset))
  }

  @Put(':id')
  @ApiOkResponse({ type: OtherAssetView, description: 'Other asset updated successfully' })
  async update(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() updateOtherAssetDto: UpdateOtherAssetInput
  ): Promise<OtherAssetView> {
    const otherAsset = await this.otherAssetsService.update(session.user.id, id, updateOtherAssetDto)
    return new OtherAssetView(prismaOtherAssetToOtherAssetView(otherAsset))
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Other asset deleted successfully' })
  async remove(
    @Session() session: UserSession,
    @Param('id') id: string
  ): Promise<void> {
    await this.otherAssetsService.remove(session.user.id, id)
  }
}
