import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from "../prisma/prisma.service"
import { EVehicleFuelType, EVehicleStatus, VehicleView } from "./dto/vehicles.view"
import { UpdateVehiclesInput } from "./dto/update-vehicles.input"

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

  async findOne({ ownerId, id }: { ownerId: string, id: string }): Promise<VehicleView> {
    const vehicle = await this.prisma.vehicle.findFirst({
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
        purchaseDate: updateVehiclesInput.purchaseDate ? new Date(updateVehiclesInput.purchaseDate) : undefined
      }
    })
    return VehicleView.fromPrisma(vehicle)
  }
}
