"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { eOtherAssetTypeMapper, IOtherAsset } from "@/models/other-asset"
import { Edit2Icon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { SheetTrigger } from "@/components/ui/sheet"

interface Props {
  data?: IOtherAsset[]
  isLoading?: boolean
  emptyMessage?: string
  onEdit: (asset: IOtherAsset) => void
}

export default function MobileOtherAssetsTable({
  data = [],
  isLoading = false,
  emptyMessage = "Nenhum ativo encontrado",
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
    <div className="space-y-3 mt-4">
      {data.map((asset) => {
        const typeInfo = eOtherAssetTypeMapper[asset.type]

        return (
          <Card key={asset.id} className="gap-1.5">
            <CardHeader className="flex items-start justify-between pb-2">
              <div className="flex items-center gap-2 flex-1">
                <h3 className="text-lg font-bold">{asset.description}</h3>
              </div>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(asset)}
                >
                  <Edit2Icon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Agência</p>
                <p className="font-semibold">{asset.agency || "-"}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Valor Atual</p>
                <p className="font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(asset.value)}
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t pt-2 pb-2">
              <Badge variant={typeInfo.variant || "default"}>
                {typeInfo.label}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Atualizado em: {format(new Date(asset.updatedAt), "dd/MM/yy HH:mm", { locale: ptBR })}
              </p>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
