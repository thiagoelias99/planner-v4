import { PartialType } from "@nestjs/swagger"
import { CreateFixedIncomeInput } from "./create-fixed-income.input"

export class UpdateFixedIncomeInput extends PartialType(CreateFixedIncomeInput) { }
