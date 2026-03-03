import { Ticker } from "../../../generated/prisma/client"
import { ETickerType, TickerView } from "../dto/tickers.view"

export function prismaTickerToTickerView(ticker: Ticker): TickerView {
  return new TickerView({
    id: ticker.id,
    symbol: ticker.symbol,
    name: ticker.name,
    type: ticker.type as ETickerType,
    price: Number(ticker.price),
    change: ticker.change ? Number(ticker.change) : undefined,
    changePercent: ticker.changePercent ? Number(ticker.changePercent) : undefined,
    autoUpdate: ticker.autoUpdate || false,
    updatedAt: ticker.updatedAt,
  })
}