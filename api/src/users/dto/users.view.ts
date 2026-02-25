import { ApiProperty } from "@nestjs/swagger"

export interface IUserView {
  id: string
  name: string
  email: string
}

export class UsersView implements IUserView {
  constructor(data: IUserView) {
    Object.assign(this, data)
  }

  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string
}