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
  variant: "default" | "secondary" | "destructive" | "outline",
  fill: string
}

export const eTickerTypeMapper: Record<ETickerType, ETickerTypeMapperType> = {
  [ETickerType.STOCK]: { label: "Ação", variant: "default", fill: "var(--color-share)" },
  [ETickerType.ETF]: { label: "ETF", variant: "secondary", fill: "var(--color-variable)" },
  [ETickerType.REIT]: { label: "FII", variant: "outline", fill: "var(--color-reit)" },
  [ETickerType.GOLD]: { label: "Ouro", variant: "default", fill: "var(--color-gold)" },
  [ETickerType.CRYPTO]: { label: "Cripto", variant: "destructive", fill: "var(--color-crypto)" },
  [ETickerType.INTERNATIONAL]: { label: "Internacional", variant: "secondary", fill: "var(--color-intl)" },
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
