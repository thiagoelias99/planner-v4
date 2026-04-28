/* eslint-disable indent */
import { OmitType, PartialType } from "@nestjs/swagger"
import { CreateBudgetCategoryInput } from "./create-category.input"

export class UpdateBudgetCategoryInput extends PartialType(OmitType(CreateBudgetCategoryInput, ["id"])) { }