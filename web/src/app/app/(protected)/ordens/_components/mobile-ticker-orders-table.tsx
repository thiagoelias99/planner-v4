"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { eTickerOrderTypeMapper, ITickerOrder } from "@/models/ticker-order"
import { Edit2Icon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { SheetTrigger } from "@/components/ui/sheet"

interface Props {
  data?: ITickerOrder[]
  isLoading?: boolean
  emptyMessage?: string
  onEdit: (tickerOrder: ITickerOrder) => void
}

export default function MobileTickerOrdersTable({
  data = [],
  isLoading = false,
  emptyMessage = "Nenhuma ordem encontrada",
  onEdit
}: Props) {

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </Card>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.map((tickerOrder) => {
        const typeInfo = eTickerOrderTypeMapper[tickerOrder.type]
        const total = tickerOrder.quantity * tickerOrder.price
        const isPositive = tickerOrder.gainLoss >= 0

        return (
          <Card key={tickerOrder.id} className="gap-1.5">
            <CardHeader className="flex items-start justify-between">
              <div className="flex items-center gap-2 flex-1">
                <h3 className="text-lg font-bold">{tickerOrder.ticker}</h3>
                <Badge variant={typeInfo.variant}>
                  {typeInfo.label}
                </Badge>
              </div>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(tickerOrder)}
                >
                  <Edit2Icon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Quantidade</p>
                <p className="font-medium">{tickerOrder.quantity}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Preço</p>
                <p className="font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(tickerOrder.price)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Total</p>
                <p className="font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(total)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Ganho/Perda</p>
                <p className={`font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    signDisplay: 'always'
                  }).format(tickerOrder.gainLoss)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Novo PM</p>
                <p className="font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(tickerOrder.newMeanPrice)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Nova Qtd</p>
                <p className="font-medium">{tickerOrder.newTotalQuantity}</p>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t pt-2">
              <p className="text-xs text-muted-foreground">
                Criado em {format(new Date(tickerOrder.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
