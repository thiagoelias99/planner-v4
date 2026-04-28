import { OmitType, PartialType } from "@nestjs/swagger"
import { CreateBudgetTransactionItemInput } from "./create-transaction-item.input"

export class UpdateBudgetTransactionItemInput extends PartialType(OmitType(CreateBudgetTransactionItemInput, ["id", "transactionId"])) { }