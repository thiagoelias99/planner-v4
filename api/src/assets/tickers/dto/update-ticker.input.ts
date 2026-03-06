import { ApiPropertyOptional, OmitType, PartialType } from "@nestjs/swagger"
import { CreateTickerInput } from "./create-ticker.input"
import { IsBoolean, IsOptional } from "class-validator"

export class UpdateTickerInput extends PartialType(OmitType(CreateTickerInput, ['symbol'])) {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  autoUpdate?: boolean
}