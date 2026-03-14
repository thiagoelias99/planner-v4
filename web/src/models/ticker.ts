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
  fill: string
}

export const eTickerTypeMapper: Record<ETickerType, ETickerTypeMapperType> = {
  [ETickerType.STOCK]: { label: "Ação", fill: "var(--color-share)" },
  [ETickerType.ETF]: { label: "ETF", fill: "var(--color-variable)" },
  [ETickerType.REIT]: { label: "FII", fill: "var(--color-reit)" },
  [ETickerType.GOLD]: { label: "Ouro", fill: "var(--color-gold)" },
  [ETickerType.CRYPTO]: { label: "Cripto", fill: "var(--color-crypto)" },
  [ETickerType.INTERNATIONAL]: { label: "Internacional", fill: "var(--color-intl)" },
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
