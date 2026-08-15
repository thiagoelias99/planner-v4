export enum EPosFixedIndex {
  NONE = 'NONE',
  CDI = 'CDI',
  IPCA = 'IPCA',
  IGPM = 'IGPM',
  INPC = 'INPC',
  SELIC = 'SELIC'
}

interface EPosFixedIndexMapperType {
  label: string,
  variant: "default" | "secondary" | "destructive" | "outline"
}

export const ePosFixedIndexMapper: Record<EPosFixedIndex, EPosFixedIndexMapperType> = {
  [EPosFixedIndex.NONE]: { label: "Nenhum", variant: "outline" },
  [EPosFixedIndex.CDI]: { label: "CDI", variant: "default" },
  [EPosFixedIndex.IPCA]: { label: "IPCA", variant: "secondary" },
  [EPosFixedIndex.IGPM]: { label: "IGP-M", variant: "secondary" },
  [EPosFixedIndex.INPC]: { label: "INPC", variant: "secondary" },
  [EPosFixedIndex.SELIC]: { label: "SELIC", variant: "default" },
}

export enum EFixedIncomeType {
  CASH_BOX = "CASH_BOX",
  PENSION = "PENSION",
  PROPERTY = "PROPERTY",
  OTHER = "OTHER",
  REITS = 'REITS',
  STOCK = 'STOCK',
  CRYPTO = 'CRYPTO',
  GOLD = 'GOLD',
  INTERNATIONAL = 'INTERNATIONAL',
  ETF = 'ETF',
  FIXED_INCOME = 'FIXED_INCOME',
}

export const eFixedIncomeTypeMapper: Record<
  EFixedIncomeType,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  [EFixedIncomeType.CASH_BOX]: { label: "Caixinha", variant: "default" },
  [EFixedIncomeType.PENSION]: { label: "Previdência", variant: "secondary" },
  [EFixedIncomeType.PROPERTY]: { label: "Imóvel", variant: "outline" },
  [EFixedIncomeType.OTHER]: { label: "Outros", variant: "secondary" },
  [EFixedIncomeType.REITS]: { label: "FII", variant: "secondary" },
  [EFixedIncomeType.STOCK]: { label: "Ações", variant: "secondary" },
  [EFixedIncomeType.CRYPTO]: { label: "Criptomoedas", variant: "secondary" },
  [EFixedIncomeType.GOLD]: { label: "Ouro", variant: "secondary" },
  [EFixedIncomeType.INTERNATIONAL]: { label: "Internacional", variant: "secondary" },
  [EFixedIncomeType.ETF]: { label: "ETF", variant: "secondary" },
  [EFixedIncomeType.FIXED_INCOME]: { label: "Renda Fixa", variant: "secondary" },
}

export interface IFixedIncome {
  id: string
  userId: string
  description: string
  agency: string | null
  note: string | null
  initialInvestment: number
  currentValue: number
  profit: number
  profitPercentage: number
  pastDays: number
  remainingDays: number
  date: Date
  dueDate: Date
  fixedRate: number
  posFixedIndex: EPosFixedIndex
  retrievedAt: Date | null
  type: EFixedIncomeType
  updatedAt: Date
}
