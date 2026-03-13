import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { OtherAsset, Prisma } from "../../generated/prisma/client"
import { PrismaService } from "../../prisma/prisma.service"
import { CreateOtherAssetInput } from "./dto/create-other-asset.input"
import { UpdateOtherAssetInput } from "./dto/update-other-asset.input"
import { QueryOtherAssetInput } from "./dto/query-other-asset.input"
import { CustomLogger } from "../../utils/logger"

@Injectable()
export class OtherAssetsService {
  constructor(private prisma: PrismaService) { }

  private readonly logger = new CustomLogger("OtherAssetsService")

  async create(userId: string, data: CreateOtherAssetInput): Promise<OtherAsset> {
    try {
      return await this.prisma.otherAsset.create({
        data: {
          userId,
          description: data.description,
          agency: data.agency,
          note: data.note,
          value: data.value,
          type: data.type,
        }
      })
    } catch (error) {
      const err = error as Error
      this.logger.error(`Unexpected error while creating other asset, ${err.message}, ${JSON.stringify(data)}`, err.stack)
      throw new InternalServerErrorException(`An unexpected error occurred while creating the other asset. Please try again later.`)
    }
  }

  async findAll(userId: string, query?: QueryOtherAssetInput): Promise<{ otherAssets: OtherAsset[], total: number }> {
    const {
      page = 1,
      limit = 10,
      orderBy = 'createdAt',
      order = 'desc',
      description,
      agency,
      type
    } = query || {}

    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.OtherAssetWhereInput = { userId }

    if (description) {
      where.description = {
        contains: description,
        mode: 'insensitive'
      }
    }

    if (agency) {
      where.agency = {
        contains: agency,
        mode: 'insensitive'
      }
    }

    if (type) {
      where.type = type
    }

    // Build orderBy clause
    const orderByClause: Prisma.OtherAssetOrderByWithRelationInput = {
      [orderBy]: order
    }

    const [otherAssets, total] = await this.prisma.$transaction([
      this.prisma.otherAsset.findMany({
        skip,
        take: limit,
        where,
        orderBy: orderByClause,
      }),
      this.prisma.otherAsset.count({ where }),
    ])

    return { otherAssets, total }
  }

  async findOne(userId: string, id: string): Promise<OtherAsset> {
    const otherAsset = await this.prisma.otherAsset.findUnique({
      where: { id, userId }
    })

    if (!otherAsset) {
      throw new NotFoundException(`Other asset with id ${id} not found.`)
    }

    return otherAsset
  }

  async update(userId: string, id: string, data: UpdateOtherAssetInput): Promise<OtherAsset> {
    try {
      // Check if other asset exists
      await this.findOne(userId, id)

      // Update the other asset
      return await this.prisma.otherAsset.update({
        where: { id, userId },
        data,
      })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      const err = error as Error
      this.logger.error(`Unexpected error while updating other asset with id ${id} for user ${userId}, ${err.message}, ${JSON.stringify(data)}`, err.stack)
      throw new InternalServerErrorException(`An unexpected error occurred while updating the other asset. Please try again later.`)
    }
  }

  async remove(userId: string, id: string): Promise<void> {
    try {
      // Check if other asset exists
      await this.findOne(userId, id)

      // Delete the other asset
      await this.prisma.otherAsset.delete({
        where: { id, userId }
      })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      const err = error as Error
      this.logger.error(`Unexpected error while deleting other asset with id ${id} for user ${userId}, ${err.message}`, err.stack)
      throw new InternalServerErrorException(`An unexpected error occurred while deleting the other asset. Please try again later.`)
    }
  }
}
