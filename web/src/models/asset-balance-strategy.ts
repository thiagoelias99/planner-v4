export interface IAssetBalanceStrategy {
  id: string
  userId: string
  notes?: string
  cashBox: number
  fixedIncome: number
  // variableIncome: number
  pension: number
  property: number
  share: number
  reit: number
  international: number
  gold: number
  crypto: number
  other: number
  createdAt: string
  updatedAt: string
}

export interface IUpdateAssetBalanceStrategy {
  notes?: string
  cashBox: number
  fixedIncome: number
  // variableIncome: number
  pension: number
  property: number
  share: number
  reit: number
  international: number
  gold: number
  crypto: number
  other: number
}
