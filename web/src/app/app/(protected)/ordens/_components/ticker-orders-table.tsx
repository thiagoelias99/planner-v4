"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/tables/template/data-table"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Edit2Icon } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import UpdateTickerOrdersForm from "./update-ticker-orders-form"
import { ETickerOrderType, eTickerOrderTypeMapper, ITickerOrder } from "@/models/ticker-order"

interface Props {
  data?: ITickerOrder[]
  isLoading?: boolean
  emptyMessage?: string
}

export default function TickerOrdersTable({
  data = [],
  isLoading = false,
  emptyMessage = "Nenhuma ordem encontrada"
}: Props) {

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedTickerOrder, setSelectedTickerOrder] = useState<ITickerOrder | null>(null)

  function getColumns(): ColumnDef<ITickerOrder>[] {
    return [
      {
        accessorKey: "ticker",
        header: () => <p className="text-start">Ticker</p>,
        cell: (row) => <p className="text-start font-medium">{row.getValue() as string}</p>,
      },
      {
        accessorKey: "type",
        header: () => <p className="text-center">Tipo</p>,
        cell: (row) => {
          const type = row.getValue() as ETickerOrderType
          const typeInfo = eTickerOrderTypeMapper[type]
          return (
            <div className="flex justify-center">
              <Badge variant={typeInfo.variant}>
                {typeInfo.label}
              </Badge>
            </div>
          )
        },
        size: 120,
      },
      {
        accessorKey: "quantity",
        header: () => <p className="text-end">Quantidade</p>,
        cell: (row) => {
          const quantity = row.getValue() as number
          return <p className="text-end font-medium">{quantity}</p>
        },
        size: 120,
      },
      {
        accessorKey: "price",
        header: () => <p className="text-end">Preço</p>,
        cell: (row) => {
          const price = row.getValue() as number
          return (
            <p className="text-end font-medium">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(price)}
            </p>
          )
        },
        size: 120,
      },
      {
        id: "total",
        header: () => <p className="text-end">Total</p>,
        cell: (row) => {
          const tickerOrder = row.row.original
          const total = tickerOrder.quantity * tickerOrder.price
          return (
            <p className="text-end font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(total)}
            </p>
          )
        },
        size: 140,
      },
      {
        accessorKey: "createdAt",
        header: () => <p className="text-center">Criado em</p>,
        cell: (row) => {
          const date = new Date(row.getValue() as Date)
          return (
            <p className="text-center text-sm text-muted-foreground">
              {format(date, "dd/MM/yyyy HH:mm", { locale: ptBR })}
            </p>
          )
        },
        size: 160,
      },
      {
        id: "actions",
        header: () => <p className="text-center">Ações</p>,
        cell: (row) => {
          const tickerOrder = row.row.original

          return (
            <div className="flex justify-center items-center gap-1">
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedTickerOrder(tickerOrder)
                    setIsSheetOpen(true)
                  }}
                >
                  <Edit2Icon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            </div>
          )
        },
        size: 100,
      }
    ]
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild className="w-full">
        <DataTable
          columns={getColumns()}
          data={data}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
        />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detalhes da Ordem</SheetTitle>
          <SheetDescription>
            Visualize e edite as informações da ordem selecionada.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          {selectedTickerOrder && (
            <UpdateTickerOrdersForm
              tickerOrder={selectedTickerOrder}
              onSuccess={() => setIsSheetOpen(false)}
              onDelete={() => setIsSheetOpen(false)}
            />
          )}
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
