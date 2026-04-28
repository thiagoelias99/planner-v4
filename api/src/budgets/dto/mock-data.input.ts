/* eslint-disable indent */
import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class MockDataInput {
  @ApiProperty()
  @IsString()
  userId: string
}