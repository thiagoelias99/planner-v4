"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ePosFixedIndexMapper, IFixedIncome } from "@/models/fixed-income"
import { Edit2Icon, Trash2Icon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { SheetTrigger } from "@/components/ui/sheet"
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
  onEdit: (fixedIncome: IFixedIncome) => void
}

export default function MobileFixedIncomesTable({
  data = [],
  isLoading = false,
  emptyMessage = "Nenhuma renda fixa encontrada",
  onEdit
}: Props) {

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
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
      {data.map((fixedIncome) => {
        const indexInfo = ePosFixedIndexMapper[fixedIncome.posFixedIndex]
        const isPositive = fixedIncome.profitPercentage >= 0
        const today = new Date()
        const dueDate = new Date(fixedIncome.dueDate)
        const isExpired = dueDate < today

        return (
          <Card key={fixedIncome.id} className="gap-1.5">
            <CardHeader className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate">{fixedIncome.description}</h3>
                {fixedIncome.agency && (
                  <p className="text-xs text-muted-foreground truncate">{fixedIncome.agency}</p>
                )}
              </div>
              <div className="flex gap-1 shrink-0 ml-2">
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(fixedIncome)}
                  >
                    <Edit2Icon className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <DeleteFixedIncomeButton fixedIncome={fixedIncome} />
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={indexInfo.variant}>
                  {indexInfo.label}
                </Badge>
                <Badge variant="outline">
                  {fixedIncome.fixedRate.toFixed(2)}%
                </Badge>
                <Badge variant={isPositive ? "default" : "destructive"}>
                  {isPositive ? "+" : ""}{fixedIncome.profitPercentage.toFixed(2)}%
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Investimento</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(fixedIncome.initialInvestment)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valor Atual</p>
                  <p className="font-bold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(fixedIncome.currentValue)}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t pt-2">
              <div>
                <p className="text-muted-foreground text-xs">Vencimento</p>
                <p className={`text-sm font-medium ${isExpired ? 'text-red-500' : ''}`}>
                  {format(dueDate, "dd/MM/yyyy", { locale: ptBR })}
                  <span className="text-xs text-muted-foreground ml-1">
                    ({fixedIncome.remainingDays > 0 ? `${fixedIncome.remainingDays} dias` : 'Vencido'})
                  </span>
                </p>
              </div>
              {fixedIncome.retrievedAt && (
                <div className="text-right">
                  <p className="text-muted-foreground text-xs">Resgatado</p>
                  <p className="text-sm">
                    {format(new Date(fixedIncome.retrievedAt), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </div>
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
