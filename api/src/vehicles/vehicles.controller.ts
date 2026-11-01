import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { VehiclesService } from './vehicles.service'
import { Session, type UserSession } from "@thallesp/nestjs-better-auth"
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger"
import { VehicleView } from "./dto/vehicles.view"
import { UpdateVehiclesInput } from "./dto/update-vehicles.input"
import { CreateFuellingInput } from "./dto/create-fueling.input"
import { UpdateFuellingInput } from "./dto/update-fueling.input"

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) { }

  @Post()
  @ApiCreatedResponse({ description: 'Vehicle created successfully', type: VehicleView })
  async create(@Session() session: UserSession) {
    return this.vehiclesService.create({ ownerId: session.user.id })
  }

  @Get()
  @ApiCreatedResponse({ description: 'List of vehicles', type: [VehicleView] })
  async findAll(@Session() session: UserSession) {
    return this.vehiclesService.findAll({ ownerId: session.user.id })
  }

  @Get(':id')
  async findOne(@Session() session: UserSession, @Param('id') id: string) {
    return this.vehiclesService.findOne({ ownerId: session.user.id, id })
  }

  @Delete(':id')
  async remove(@Session() session: UserSession, @Param('id') id: string) {
    return this.vehiclesService.remove({ ownerId: session.user.id, id })
  }

  @Put(':id')
  async update(@Session() session: UserSession, @Param('id') id: string, @Body() updateVehiclesInput: UpdateVehiclesInput) {
    return this.vehiclesService.update({ ownerId: session.user.id, id, updateVehiclesInput })
  }

  @Post(":id/fueling")
  async fueling(@Session() session: UserSession, @Param('id') id: string, @Body() dto: CreateFuellingInput) {
    return this.vehiclesService.createFueling({ ownerId: session.user.id, vehicleId: id, dto })
  }

  @Put(":id/fueling/:fuelingId")
  async updateFueling(@Session() session: UserSession, @Param('id') id: string, @Param('fuelingId') fuelingId: string, @Body() dto: UpdateFuellingInput) {
    return this.vehiclesService.updateFueling({ ownerId: session.user.id, vehicleId: id, fuelingId, dto })
  }

  @Delete(":id/fueling/:fuelingId")
  async removeFueling(@Session() session: UserSession, @Param('id') id: string, @Param('fuelingId') fuelingId: string) {
    return this.vehiclesService.removeFueling({ ownerId: session.user.id, vehicleId: id, fuelingId })
  }
}
