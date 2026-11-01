import { OmitType, PartialType } from "@nestjs/swagger"
import { CreateFuellingInput } from "./create-fueling.input"

export class UpdateFuellingInput extends PartialType(OmitType(CreateFuellingInput, [])) { }