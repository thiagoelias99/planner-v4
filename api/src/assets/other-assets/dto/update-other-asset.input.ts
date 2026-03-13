import { PartialType } from "@nestjs/swagger"
import { CreateOtherAssetInput } from "./create-other-asset.input"

export class UpdateOtherAssetInput extends PartialType(CreateOtherAssetInput) {}
