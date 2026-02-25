import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsStrongPassword } from "class-validator"

export class SignInInput {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Email of the user' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'P@ssword123', description: 'Password of the user' })
  @IsStrongPassword()
  password: string
}