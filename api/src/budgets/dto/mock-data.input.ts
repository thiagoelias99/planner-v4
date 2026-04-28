/* eslint-disable indent */
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class MockDataInput {
  @ApiProperty()
  @IsUUID()
  userId: string
}