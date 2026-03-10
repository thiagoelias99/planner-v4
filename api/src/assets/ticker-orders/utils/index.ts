import { TickerOrder } from "../../../generated/prisma/client"
import { ETickerOrderType, TickerOrderView } from "../dto/ticker-orders.view"

export function prismaTickerOrderToTickerOrderView(tickerOrder: TickerOrder): TickerOrderView {
  return new TickerOrderView({
    id: tickerOrder.id,
    userId: tickerOrder.userId,
    ticker: tickerOrder.ticker,
    type: tickerOrder.type as ETickerOrderType,
    quantity: tickerOrder.quantity,
    price: Number(tickerOrder.price),
    previousMeanPrice: Number(tickerOrder.previousMeanPrice),
    previousTotalQuantity: tickerOrder.previousTotalQuantity,
    gainLoss: Number(tickerOrder.gainLoss),
    newMeanPrice: Number(tickerOrder.newMeanPrice),
    newTotalQuantity: tickerOrder.newTotalQuantity,
    createdAt: tickerOrder.createdAt,
    updatedAt: tickerOrder.updatedAt,
  })
}
