/* eslint-disable indent */
import { ApiProperty } from "@nestjs/swagger"
import { IsDateString } from "class-validator"
import { endOfMonth, startOfMonth } from "date-fns"

export class QueryBudgetInput {

  @ApiProperty({ example: startOfMonth(new Date()) })
  @IsDateString()
  from: Date

  @ApiProperty({ example: endOfMonth(new Date()) })
  @IsDateString()
  to: Date
}