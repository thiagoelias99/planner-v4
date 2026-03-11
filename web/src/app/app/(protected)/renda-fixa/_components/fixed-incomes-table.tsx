"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "../../../../../components/tables/template/data-table"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import { Button } from "../../../../../components/ui/button"
import { Edit2Icon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../../../../../components/ui/sheet"
import { Badge } from "../../../../../components/ui/badge"
import UpdateFixedIncomesForm from "./update-fixed-incomes-form"
import { EPosFixedIndex, ePosFixedIndexMapper, IFixedIncome } from "@/models/fixed-income"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useFixedIncome } from "@/hooks/query/use-fixed-income"
import { toast } from "sonner"

interface Props {
  data?: IFixedIncome[]
  isLoading?: boolean
  emptyMessage?: string
}

export default function FixedIncomesTable({
  data = [],
  isLoading = false,
  emptyMessage = "Nenhuma renda fixa encontrada"
}: Props) {

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedFixedIncome, setSelectedFixedIncome] = useState<IFixedIncome | null>(null)

  function getColumns(): ColumnDef<IFixedIncome>[] {
    return [
      {
        accessorKey: "description",
        header: () => <p className="text-start">Descrição</p>,
        cell: (row) => {
          const description = row.getValue() as string
          const fixedIncome = row.row.original
          return (
            <div className="flex flex-col">
              <p className="text-start font-bold">{description}</p>
              {fixedIncome.agency && <p className="text-start text-xs text-muted-foreground">{fixedIncome.agency}</p>}
            </div>
          )
        },
      },
      {
        accessorKey: "posFixedIndex",
        header: () => <p className="text-center">Índice</p>,
        cell: (row) => {
          const index = row.getValue() as EPosFixedIndex
          const indexInfo = ePosFixedIndexMapper[index]
          return (
            <div className="flex justify-center">
              <Badge variant={indexInfo.variant}>
                {indexInfo.label}
              </Badge>
            </div>
          )
        },
        size: 120,
      },
      {
        accessorKey: "fixedRate",
        header: () => <p className="text-center">Taxa</p>,
        cell: (row) => {
          const rate = row.getValue() as number
          return <p className="text-center font-semibold">{rate.toFixed(2)}%</p>
        },
        size: 100,
      },
      {
        accessorKey: "initialInvestment",
        header: () => <p className="text-end">Investimento</p>,
        cell: (row) => {
          const value = row.getValue() as number
          return (
            <p className="text-end">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            </p>
          )
        },
        size: 130,
      },
      {
        accessorKey: "currentValue",
        header: () => <p className="text-end">Valor Atual</p>,
        cell: (row) => {
          const value = row.getValue() as number
          return (
            <p className="text-end font-semibold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            </p>
          )
        },
        size: 130,
      },
      {
        accessorKey: "profitPercentage",
        header: () => <p className="text-center">Rentabilidade</p>,
        cell: (row) => {
          const profitPercentage = row.getValue() as number
          const isPositive = profitPercentage >= 0
          return (
            <div className="flex justify-center">
              <Badge variant={isPositive ? "default" : "destructive"}>
                {isPositive ? "+" : ""}{profitPercentage.toFixed(2)}%
              </Badge>
            </div>
          )
        },
        size: 130,
      },
      {
        accessorKey: "dueDate",
        header: () => <p className="text-center">Vencimento</p>,
        cell: (row) => {
          const date = row.getValue() as Date
          const fixedIncome = row.row.original
          const today = new Date()
          const dueDate = new Date(date)
          const isExpired = dueDate < today

          return (
            <div className="flex flex-col items-center">
              <p className={`text-center text-sm ${isExpired ? 'text-red-500 font-semibold' : ''}`}>
                {format(new Date(date), "dd/MM/yyyy", { locale: ptBR })}
              </p>
              <p className="text-xs text-muted-foreground">
                {fixedIncome.remainingDays > 0 ? `${fixedIncome.remainingDays} dias` : 'Vencido'}
              </p>
            </div>
          )
        },
        size: 120,
      },
      {
        accessorKey: "retrievedAt",
        header: () => <p className="text-center">Resgate</p>,
        cell: (row) => {
          const date = row.getValue() as Date | null
          if (!date) {
            return <p className="text-center text-sm text-muted-foreground">-</p>
          }
          return (
            <p className="text-center text-sm">
              {format(new Date(date), "dd/MM/yyyy", { locale: ptBR })}
            </p>
          )
        },
        size: 120,
      },
      {
        id: "actions",
        header: () => <p className="text-center">Ações</p>,
        cell: (row) => {
          const fixedIncome = row.row.original

          return (
            <div className="flex justify-center items-center gap-1">
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedFixedIncome(fixedIncome)
                    setIsSheetOpen(true)
                  }}
                >
                  <Edit2Icon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <DeleteFixedIncomeButton fixedIncome={fixedIncome} />
            </div>
          )
        },
        size: 120,
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
          <SheetTitle>Detalhes da Renda Fixa</SheetTitle>
          <SheetDescription>
            Visualize e edite as informações da renda fixa selecionada.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          {selectedFixedIncome && <UpdateFixedIncomesForm fixedIncome={selectedFixedIncome} onSuccess={() => setIsSheetOpen(false)} />}
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

function DeleteFixedIncomeButton({ fixedIncome }: { fixedIncome: IFixedIncome }) {
  const { deleteFixedIncome } = useFixedIncome(fixedIncome.id)

  async function handleDelete() {
    try {
      await deleteFixedIncome.mutateAsync()
      toast.success("Renda fixa excluída com sucesso!")
    } catch {
      toast.error("Erro ao excluir renda fixa")
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash2Icon className="h-4 w-4 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a renda fixa <strong>{fixedIncome.description}</strong>? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
