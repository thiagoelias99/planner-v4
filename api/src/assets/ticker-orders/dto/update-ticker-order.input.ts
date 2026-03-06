import { OmitType, PartialType } from "@nestjs/swagger"
import { CreateTickerOrderInput } from "./create-ticker-order.input"

export class UpdateTickerOrderInput extends PartialType(OmitType(CreateTickerOrderInput, ["ticker"])) { }
