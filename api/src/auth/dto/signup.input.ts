import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, IsStrongPassword } from "class-validator"

export class SignUpInput {
  @ApiProperty({ example: 'John Doe', description: 'Name of the user' })
  @IsString()
  name: string

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email of the user' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'P@ssword123', description: 'Password of the user' })
  @IsStrongPassword()
  password: string
}