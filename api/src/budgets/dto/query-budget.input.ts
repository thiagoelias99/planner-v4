/* eslint-disable indent */
import { ApiProperty } from "@nestjs/swagger"
import { IsDateString } from "class-validator"

export class QueryBudgetInput {

  @ApiProperty()
  @IsDateString()
  from: Date

  @ApiProperty()
  @IsDateString()
  to: Date
}