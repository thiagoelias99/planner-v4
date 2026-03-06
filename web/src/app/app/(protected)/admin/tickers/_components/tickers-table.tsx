"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "../../../../../../components/tables/template/data-table"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import { Button } from "../../../../../../components/ui/button"
import { Edit2Icon } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../../../../../../components/ui/sheet"
import { Badge } from "../../../../../../components/ui/badge"
import UpdateTickersForm from "./update-tickers-form"
import { ETickerType, eTickerTypeMapper, ITicker } from "@/models/ticker"

interface Props {
  data?: ITicker[]
  isLoading?: boolean
  emptyMessage?: string
}

export default function TickersTable({
  data = [],
  isLoading = false,
  emptyMessage = "Nenhum ticker encontrado"
}: Props) {

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedTicker, setSelectedTicker] = useState<ITicker | null>(null)

  function getColumns(): ColumnDef<ITicker>[] {
    return [
      {
        accessorKey: "symbol",
        header: () => <p className="text-start">Símbolo</p>,
        cell: (row) => <p className="text-start font-bold">{row.getValue() as string}</p>,
        size: 120,
      },
      {
        accessorKey: "name",
        header: () => <p className="text-start">Nome</p>,
        cell: (row) => <p className="text-start">{row.getValue() as string}</p>,
      },
      {
        accessorKey: "type",
        header: () => <p className="text-center">Tipo</p>,
        cell: (row) => {
          const type = row.getValue() as ETickerType
          const typeInfo = eTickerTypeMapper[type]
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
        accessorKey: "price",
        header: () => <p className="text-end">Preço</p>,
        cell: (row) => {
          const price = row.getValue() as number
          return (
            <p className="text-end font-semibold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
            </p>
          )
        },
        size: 120,
      },
      {
        accessorKey: "changePercent",
        header: () => <p className="text-center">Variação</p>,
        cell: (row) => {
          const changePercent = row.getValue() as number | undefined
          if (changePercent === undefined) return <p className="text-center text-muted-foreground">-</p>
          const isPositive = changePercent >= 0
          return (
            <div className="flex justify-center">
              <Badge variant={isPositive ? "default" : "destructive"}>
                {isPositive ? "+" : ""}{changePercent.toFixed(2)}%
              </Badge>
            </div>
          )
        },
        size: 120,
      },
      {
        accessorKey: "autoUpdate",
        header: () => <p className="text-center">Auto-update</p>,
        cell: (row) => {
          const autoUpdate = row.getValue() as boolean
          return (
            <div className="flex justify-center">
              <Badge variant={autoUpdate ? "default" : "secondary"}>
                {autoUpdate ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          )
        },
        size: 120,
      },
      {
        accessorKey: "updatedAt",
        header: () => <p className="text-center">Atualizado em</p>,
        cell: (row) => {
          const date = row.getValue() as Date
          return (
            <p className="text-center text-sm text-muted-foreground">
              {format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
            </p>
          )
        },
        size: 150,
      },
      {
        id: "actions",
        header: () => <p className="text-center">Ações</p>,
        cell: (row) => {
          const ticker = row.row.original

          return (
            <div className="flex justify-center items-center gap-1">
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedTicker(ticker)
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
          <SheetTitle>Detalhes do Ticker</SheetTitle>
          <SheetDescription>
            Visualize e edite as informações do ticker selecionado.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          {selectedTicker && <UpdateTickersForm ticker={selectedTicker} onSuccess={() => setIsSheetOpen(false)} />}
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
