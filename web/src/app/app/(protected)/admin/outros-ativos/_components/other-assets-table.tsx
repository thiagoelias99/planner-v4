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
import UpdateOtherAssetsForm from "./update-other-assets-form"
import { EOtherAssetType, eOtherAssetTypeMapper, IOtherAsset } from "@/models/other-asset"
import MobileOtherAssetsTable from "./mobile-other-assets-table"

interface Props {
  data?: IOtherAsset[]
  isLoading?: boolean
  emptyMessage?: string
}

export default function OtherAssetsTable({
  data = [],
  isLoading = false,
  emptyMessage = "Nenhum ativo encontrado"
}: Props) {

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<IOtherAsset | null>(null)

  function getColumns(): ColumnDef<IOtherAsset>[] {
    return [
      {
        accessorKey: "description",
        header: () => <p className="text-start">Descrição</p>,
        cell: (row) => <p className="text-start font-bold">{row.getValue() as string}</p>,
        size: 250,
      },
      {
        accessorKey: "agency",
        header: () => <p className="text-center">Agência</p>,
        cell: (row) => <p className="text-center">{row.getValue() as string || "-"}</p>,
      },
      {
        accessorKey: "type",
        header: () => <p className="text-center">Tipo</p>,
        cell: (row) => {
          const type = row.getValue() as EOtherAssetType
          const typeInfo = eOtherAssetTypeMapper[type]
          return (
            <div className="flex justify-center">
              <Badge variant={typeInfo.variant || "default"}>
                {typeInfo.label}
              </Badge>
            </div>
          )
        },
        size: 150,
      },
      {
        accessorKey: "value",
        header: () => <p className="text-center">Valor</p>,
        cell: (row) => {
          const value = row.getValue() as number
          return (
            <p className="text-center font-semibold text-primary">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            </p>
          )
        },
        size: 150,
      },
      {
        accessorKey: "updatedAt",
        header: () => <p className="text-center">Atualizado em</p>,
        cell: (row) => {
          const date = row.getValue() as string
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
          const asset = row.row.original

          return (
            <div className="flex justify-center items-center gap-1">
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedAsset(asset)
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
        <div>
          <div className="hidden md:block">
            <DataTable
              columns={getColumns()}
              data={data}
              isLoading={isLoading}
              emptyMessage={emptyMessage}
            />
          </div>
          <div className="md:hidden">
            <MobileOtherAssetsTable
              data={data}
              isLoading={isLoading}
              emptyMessage={emptyMessage}
              onEdit={(asset) => {
                setSelectedAsset(asset)
                setIsSheetOpen(true)
              }}
            />
          </div>
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>Detalhes do Ativo</SheetTitle>
          <SheetDescription>
            Visualize e edite as informações do ativo selecionado.
          </SheetDescription>
        </SheetHeader>
        <SheetBody className="flex-1 overflow-y-auto pr-2 pb-4 pt-4">
          {selectedAsset && (
            <UpdateOtherAssetsForm 
              asset={selectedAsset} 
              onSuccess={() => setIsSheetOpen(false)} 
              onDeleted={() => setIsSheetOpen(false)}
            />
          )}
        </SheetBody>
        <SheetFooter className="mt-auto border-t pt-4">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
