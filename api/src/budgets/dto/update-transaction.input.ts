import { OmitType, PartialType } from "@nestjs/swagger"
import { CreateBudgetTransactionInput } from "./create-transaction.input"

export class UpdateBudgetTransactionInput extends PartialType(OmitType(CreateBudgetTransactionInput, ["id"])) { }