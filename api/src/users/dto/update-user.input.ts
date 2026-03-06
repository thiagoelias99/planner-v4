import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator'
import { EUserRole } from "../utils/user-role"

export class UpdateUserInput {
  @ApiPropertyOptional({ example: 'John Doe', description: 'Name of the user' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'Email address of the user' })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional({ example: true, description: 'Indicates if the email is verified' })
  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'URL of the user avatar' })
  @IsUrl()
  @IsOptional()
  image?: string

  @ApiPropertyOptional({ example: EUserRole.USER, enum: EUserRole, description: 'Role of the user' })
  @IsEnum(EUserRole)
  @IsOptional()
  role?: EUserRole
}