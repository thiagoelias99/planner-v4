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
  updatedAt: Date
}
