import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from "../prisma/prisma.service"
import { EVehicleFuelType, EVehicleStatus, VehicleDetailedView, VehicleView } from "./dto/vehicles.view"
import { UpdateVehiclesInput } from "./dto/update-vehicles.input"
import { CreateFuellingInput } from "./dto/create-fueling.input"
import { UpdateFuellingInput } from "./dto/update-fueling.input"
import { Prisma } from "@prisma/client"
import { FipePlateView } from "./dto/fipe-plate.view"

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) { }

  async create({ ownerId }: { ownerId: string }): Promise<VehicleView> {
    const vehicle = await this.prisma.vehicle.create({
      data: {
        ownerId,
        brand: "",
        model: "",
        year: 2000,
        fuelType: EVehicleFuelType.GASOLINE,
        status: EVehicleStatus.ACTIVE
      }
    })
    return VehicleView.fromPrisma(vehicle)
  }

  async findAll({ ownerId }: { ownerId: string }) {
    const vehicles = await this.prisma.vehicle.findMany({
      where: {
        ownerId
      }
    })

    return vehicles.map(vehicle => VehicleView.fromPrisma(vehicle))
  }

  async findOne({ ownerId, id }: { ownerId: string, id: string }): Promise<VehicleDetailedView> {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        ownerId,
        id
      },
      include: {
        Fuelings: {
          orderBy: {
            odometer: 'desc'
          }
        },
        FuelConsumptions: true
      }
    })
    if (!vehicle) {
      throw new BadRequestException('Vehicle not found')
    }
    return VehicleDetailedView.fromPrisma(vehicle)
  }

  async remove({ ownerId, id }: { ownerId: string, id: string }): Promise<VehicleView> {
    const vehicle = await this.prisma.vehicle.delete({
      where: {
        ownerId,
        id
      }
    })
    if (!vehicle) {
      throw new BadRequestException('Vehicle not found')
    }
    return VehicleView.fromPrisma(vehicle)
  }

  async update({ ownerId, id, updateVehiclesInput }: { ownerId: string, id: string, updateVehiclesInput: UpdateVehiclesInput }): Promise<VehicleView> {

    // Verificar ids de transações associadas (fuellingTransactionId e maintenanceTransactionId) se houver

    if (updateVehiclesInput.fuellingTransactionId) {
      const fuellingTransaction = await this.prisma.transaction.findFirst({
        where: { id: updateVehiclesInput.fuellingTransactionId, userId: ownerId }
      })
      if (!fuellingTransaction) {
        throw new BadRequestException('Fuelling transaction not found')
      }
    }

    if (updateVehiclesInput.maintenanceTransactionId) {
      const maintenanceTransaction = await this.prisma.transaction.findFirst({
        where: { id: updateVehiclesInput.maintenanceTransactionId, userId: ownerId }
      })
      if (!maintenanceTransaction) {
        throw new BadRequestException('Maintenance transaction not found')
      }
    }


    const vehicle = await this.prisma.vehicle.update({
      where: {
        ownerId,
        id
      },
      data: {
        ...updateVehiclesInput,
        purchaseDate: updateVehiclesInput.purchaseDate ? new Date(updateVehiclesInput.purchaseDate) : undefined,
        plate: updateVehiclesInput.plate?.replaceAll('-', '').toUpperCase(),
      }
    })
    return VehicleView.fromPrisma(vehicle)
  }

  async createFueling({ ownerId, vehicleId, dto }: { ownerId: string, vehicleId: string, dto: CreateFuellingInput }): Promise<VehicleDetailedView> {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        ownerId,
        id: vehicleId
      }
    })
    if (!vehicle) {
      throw new BadRequestException('Vehicle not found')
    }

    const pricePerLiter = dto.totalAmount / dto.liters

    // const transaction = await this.prisma.transaction.findFirst({
    //   where: { id: vehicle.fuellingTransactionId || "none" }
    // })

    // Fazer as operações a seguir utilizando transaction do banco de dados
    const fueling = await this.prisma.$transaction(async (prismaTransaction) => {
      const fueling = await prismaTransaction.fueling.create({
        data: {
          vehicleId,
          date: new Date(dto.date),
          odometer: dto.odometer,
          fuelType: dto.fuelType,
          liters: dto.liters,
          pricePerLiter: pricePerLiter,
          totalAmount: dto.totalAmount,
          fullTank: dto.fullTank,
        }
      })

      await prismaTransaction.vehicle.update({
        where: { id: vehicleId },
        data: { currentOdometer: dto.odometer }
      })

      if (vehicle.fuellingTransactionId) {
        await prismaTransaction.transactionItem.create({
          data: {
            id: fueling.id, // o item da transação compartilha o id do abastecimento
            userId: ownerId,
            transactionId: vehicle.fuellingTransactionId,
            paymentMethod: dto.paymentMethod,
            date: new Date(dto.date),
            value: dto.totalAmount,
            active: true,
            Fuelings: {
              connect: { id: fueling.id }
            }
          }
        })
      }

      // Caso seja um "fullTank", registrar consumo
      if (dto.fullTank) {
        const previousFullTank = await prismaTransaction.fueling.findFirst({
          where: {
            vehicleId,
            fullTank: true,
            id: { not: fueling.id },
            odometer: { lt: dto.odometer }
          },
          orderBy: { odometer: 'desc' }
        })

        if (previousFullTank) {
          // Localiza o último tanque cheio anterior se existir
          // Litros abastecidos após o tanque cheio anterior até o atual (inclusive); o do tanque anterior não entra
          const intermediate = await prismaTransaction.fueling.findMany({
            where: {
              vehicleId,
              odometer: { gt: previousFullTank.odometer, lte: dto.odometer }
            },
            select: { liters: true }
          })

          // Soma todos os litros entre eles.
          const litersConsumed = intermediate.reduce((sum, f) => sum + Number(f.liters), 0)

          // Calcula a distância percorrida desde o último tanque cheio.
          const distanceKm = dto.odometer - previousFullTank.odometer

          // Calcula o consumo médio em km por litro.
          const averageKmPerLiter = distanceKm / litersConsumed

          if (litersConsumed > 0 && distanceKm > 0) {
            await prismaTransaction.fuelConsumption.create({
              data: {
                vehicleId,
                startFuelingId: previousFullTank.id,
                endFuelingId: fueling.id,
                distanceKm,
                litersConsumed,
                averageKmPerLiter
              }
            })
          }
        }
      }

      return this.findOne({ ownerId, id: vehicleId })
    })
    return this.findOne({ ownerId, id: vehicleId })
  }

  async updateFueling({ ownerId, vehicleId, fuelingId, dto }: { ownerId: string, vehicleId: string, fuelingId: string, dto: UpdateFuellingInput }): Promise<VehicleDetailedView> {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { ownerId, id: vehicleId }
    })
    if (!vehicle) {
      throw new BadRequestException('Vehicle not found')
    }

    const current = await this.prisma.fueling.findFirst({
      where: { id: fuelingId, vehicleId }
    })
    if (!current) {
      throw new BadRequestException('Fueling not found')
    }

    const liters = dto.liters ?? Number(current.liters)
    const totalAmount = dto.totalAmount ?? Number(current.totalAmount)
    const date = dto.date ? new Date(dto.date) : current.date
    // Mantém a transação já vinculada; abastecimentos sem vínculo usam a transação atual do veículo
    const transactionId = current.transactionId

    return this.prisma.$transaction(async (prismaTransaction) => {
      const fueling = await prismaTransaction.fueling.update({
        where: { id: fuelingId },
        data: {
          transactionId,
          date,
          odometer: dto.odometer,
          fuelType: dto.fuelType,
          liters,
          totalAmount,
          pricePerLiter: totalAmount / liters,
          fullTank: dto.fullTank,
        }
      })

      await prismaTransaction.vehicle.update({
        where: { id: vehicleId },
        data: { currentOdometer: fueling.odometer }
      })

      if (transactionId) {
        const item = await prismaTransaction.transactionItem.findFirst({
          where: { id: transactionId, userId: ownerId }
        })

        if (item) {
          await prismaTransaction.transactionItem.update({
            where: { id: transactionId },
            data: {
              paymentMethod: dto.paymentMethod,
              date,
              value: totalAmount
            }
          })
        }
      }

      // Odômetro, litros ou fullTank podem alterar vários intervalos; recalcula todos os consumos do veículo
      await this.recalculateFuelConsumption({ vehicleId, prisma: prismaTransaction })

      return this.findOne({ ownerId, id: vehicleId })
    })
  }

  async removeFueling({ ownerId, vehicleId, fuelingId }: { ownerId: string, vehicleId: string, fuelingId: string }) {
    return this.prisma.$transaction(async (prismaTransaction) => {
      const fueling = await prismaTransaction.fueling.findFirst({
        where: { id: fuelingId, vehicleId }
      })

      if (!fueling) {
        throw new BadRequestException('Fueling not found')
      }

      await prismaTransaction.fuelConsumption.deleteMany({ where: { vehicleId } })

      await prismaTransaction.fueling.delete({ where: { id: fuelingId } })

      // Delete the associated transaction item if it exists
      if (fueling.transactionId) {
        await prismaTransaction.transactionItem.deleteMany({ where: { id: fueling.transactionId } })
      }

      // Recalculate fuel consumption after deletion
      await this.recalculateFuelConsumption({ vehicleId, prisma: prismaTransaction })

      return fueling
    })
  }

  async recalculateFuelConsumption({ vehicleId, prisma }: { vehicleId: string, prisma: Prisma.TransactionClient }) {
    const all = await prisma.fueling.findMany({
      where: { vehicleId },
      orderBy: { odometer: 'asc' }
    })

    await prisma.fuelConsumption.deleteMany({ where: { vehicleId } })

    let lastFullTank: (typeof all)[number] | null = null
    let litersSince = 0

    for (const f of all) {
      litersSince += Number(f.liters)
      if (!f.fullTank) continue

      if (lastFullTank) {
        const distanceKm = f.odometer - lastFullTank.odometer
        if (distanceKm > 0 && litersSince > 0) {
          await prisma.fuelConsumption.create({
            data: {
              vehicleId,
              startFuelingId: lastFullTank.id,
              endFuelingId: f.id,
              distanceKm,
              litersConsumed: litersSince,
              averageKmPerLiter: distanceKm / litersSince
            }
          })
        }
      }
      lastFullTank = f
      litersSince = 0
    }
  }

  async getFipeByPlate(plate: string): Promise<FipePlateView> {
    const apiKey = process.env.FIPE_API_KEY

    if (!apiKey) {
      throw new InternalServerErrorException('FIPE API key is not configured')
    }

    const endpoint = `https://fipe.parallelum.com.br/api/v2/plates/${plate}`
    const response = await fetch(endpoint, {
      headers: {
        'X-Subscription-Token': `${apiKey}`
      }
    })
    return response.json()
  }
}
