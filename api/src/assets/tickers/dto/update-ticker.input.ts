import { OmitType, PartialType } from "@nestjs/swagger"
import { CreateTickerInput } from "./create-ticker.input"

export class UpdateTickerInput extends PartialType(OmitType(CreateTickerInput, ['symbol'])) {

}