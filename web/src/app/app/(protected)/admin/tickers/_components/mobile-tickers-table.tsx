"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { eTickerTypeMapper, ITicker } from "@/models/ticker"
import { Edit2Icon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { SheetTrigger } from "@/components/ui/sheet"

interface Props {
  data?: ITicker[]
  isLoading?: boolean
  emptyMessage?: string
  onEdit: (ticker: ITicker) => void
}

export default function MobileTickersTable({
  data = [],
  isLoading = false,
  emptyMessage = "Nenhum ticker encontrado",
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
      {data.map((ticker) => {
        const typeInfo = eTickerTypeMapper[ticker.type]
        const changePercent = ticker.changePercent
        const hasChange = changePercent !== undefined
        const isPositive = hasChange && changePercent >= 0

        return (
          <Card key={ticker.id} className="gap-1.5">
            <CardHeader className="flex items-start justify-between">
              <div className="flex items-center gap-2 flex-1">
                <h3 className="text-lg font-bold">{ticker.symbol}</h3>
                <Badge variant={typeInfo.variant}>
                  {typeInfo.label}
                </Badge>
              </div>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(ticker)}
                >
                  <Edit2Icon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Preço</p>
                <p className="font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(ticker.price)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Variação</p>
                {hasChange ? (
                  <Badge variant={isPositive ? "default" : "destructive"}>
                    {isPositive ? "+" : ""}{changePercent.toFixed(2)}%
                  </Badge>
                ) : (
                  <p className="text-muted-foreground">-</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t pt-2">
              <Badge variant={ticker.autoUpdate ? "default" : "secondary"}>
                Auto-update: {ticker.autoUpdate ? "Ativo" : "Inativo"}
              </Badge>
              <p className="text-xs text-muted-foreground">
                {format(new Date(ticker.updatedAt), "dd/MM/yy HH:mm", { locale: ptBR })}
              </p>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
