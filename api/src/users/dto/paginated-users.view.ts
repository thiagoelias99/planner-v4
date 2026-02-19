import { ApiProperty } from "@nestjs/swagger"
import { UsersView } from "./users.view"

export class PaginatedUserView {
  constructor(data: {
    page: number
    limit: number
    total: number
    users: UsersView[]
  }) {
    this.page = data.page
    this.limit = data.limit
    this.total = data.total
    this.totalPages = Math.ceil(data.total / data.limit)
    this.data = data.users
  }

  @ApiProperty({ description: "Current page number", example: 1 })
  page: number

  @ApiProperty({ description: "Number of items per page", example: 8 })
  limit: number

  @ApiProperty({ description: "Total number of items", example: 100 })
  total: number

  @ApiProperty({ description: "Total number of pages", example: 13 })
  totalPages: number

  @ApiProperty({ description: "List of users for the current page", type: [UsersView] })
  data: UsersView[]
}