/* eslint-disable indent */
import { ApiProperty } from "@nestjs/swagger"

export class UploadInvoiceView {

  @ApiProperty({ required: false })
  date: string | null

  @ApiProperty({ required: false })
  totalAmount: number | null

  @ApiProperty({ required: false })
  paymentMethod: string | null

  @ApiProperty({ required: false })
  transactionId: string | null

  @ApiProperty({ required: false })
  transactionSuggestion: string | null
}