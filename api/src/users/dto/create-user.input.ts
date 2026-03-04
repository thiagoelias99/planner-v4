import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEmail, IsOptional, IsString, IsStrongPassword } from 'class-validator'

export class CreateUserInput {
  @ApiProperty({ example: 'John Doe', description: 'Name of the user' })
  @IsString()
  name: string

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'P@ssword123', description: 'Password of the user' })
  @IsStrongPassword()
  password: string
}