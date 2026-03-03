import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator"

export class SignInInput {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Email of the user' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'P@ssword123', description: 'Password of the user' })
  @IsStrongPassword()
  password: string
}

export class SocialSignInInput {
  @ApiPropertyOptional({ description: 'Redirect URI after social sign-in', example: `${process.env.BASE_URL}/v1/docs` })
  @IsString()
  @IsOptional()
  redirectUri?: string
}