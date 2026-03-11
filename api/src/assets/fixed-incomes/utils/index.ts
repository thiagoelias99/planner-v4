import { FixedIncome } from "../../../generated/prisma/client"
import { EPosFixedIndex, FixedIncomeView } from "../dto/fixed-incomes.view"

export function prismaFixedIncomeToFixedIncomeView(fixedIncome: FixedIncome): FixedIncomeView {
  return new FixedIncomeView({
    id: fixedIncome.id,
    userId: fixedIncome.userId,
    description: fixedIncome.description,
    agency: fixedIncome.agency,
    note: fixedIncome.note,
    initialInvestment: Number(fixedIncome.initialInvestment),
    currentValue: Number(fixedIncome.currentValue),
    date: fixedIncome.date,
    dueDate: fixedIncome.dueDate,
    fixedRate: Number(fixedIncome.fixedRate),
    posFixedIndex: fixedIncome.posFixedIndex as EPosFixedIndex,
    retrievedAt: fixedIncome.retrievedAt,
    updatedAt: fixedIncome.updatedAt,
  })
}
