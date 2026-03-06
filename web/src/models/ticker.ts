export enum ETickerType {
  STOCK = 'STOCK',
  ETF = 'ETF',
  REIT = 'REIT',
  GOLD = 'GOLD',
  CRYPTO = 'CRYPTO',
  INTERNATIONAL = 'INTERNATIONAL'
}

interface ETickerTypeMapperType {
  label: string,
  variant: "default" | "secondary" | "destructive" | "outline"
}

export const eTickerTypeMapper: Record<ETickerType, ETickerTypeMapperType> = {
  [ETickerType.STOCK]: { label: "Ação", variant: "default" },
  [ETickerType.ETF]: { label: "ETF", variant: "secondary" },
  [ETickerType.REIT]: { label: "FII", variant: "outline" },
  [ETickerType.GOLD]: { label: "Ouro", variant: "default" },
  [ETickerType.CRYPTO]: { label: "Cripto", variant: "destructive" },
  [ETickerType.INTERNATIONAL]: { label: "Internacional", variant: "secondary" },
}

export interface ITicker {
  id: string
  name: string
  symbol: string
  type: ETickerType
  price: number
  change?: number
  changePercent?: number
  autoUpdate: boolean
  updatedAt: Date
}
