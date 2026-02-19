import { ApiProperty } from "@nestjs/swagger"

export interface IUserView {
  id: number
  name: string
  email: string
}

export class UsersView implements IUserView {
  constructor(data: IUserView) {
    Object.assign(this, data)
  }

  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string
}