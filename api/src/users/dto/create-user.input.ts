import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEmail, IsOptional, IsString } from 'class-validator'

export class CreateUserInput {
  @ApiProperty({ example: 'John Doe', description: 'Name of the user' })
  @IsString()
  name: string

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  @IsEmail()
  email: string
}