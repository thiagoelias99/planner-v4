export enum ETickerOrderType {
  BUY = 'BUY',
  SELL = 'SELL',
}

interface ETickerOrderTypeMapperType {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
}

export const eTickerOrderTypeMapper: Record<ETickerOrderType, ETickerOrderTypeMapperType> = {
  [ETickerOrderType.BUY]: { label: "Compra", variant: "default" },
  [ETickerOrderType.SELL]: { label: "Venda", variant: "destructive" },
}

export interface ITickerOrder {
  id: string
  userId: string
  ticker: string
  type: ETickerOrderType
  quantity: number
  price: number
  createdAt: Date
  updatedAt: Date
}
