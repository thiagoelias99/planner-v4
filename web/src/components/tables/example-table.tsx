"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./template/data-table"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import { Button } from "../ui/button"
import { EditIcon, EyeIcon, TrashIcon } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { User } from "@/generated/prisma/client"

interface Props {
  data?: User[]
  isLoading?: boolean
  emptyMessage?: string,
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number,
    handlePageChange?: (page: number) => void
  }
  onEdit?: (user: User) => void
  onDelete?: (user: User) => void
}

export default function ExampleTable({
  data = [],
  isLoading = false,
  emptyMessage = "Nenhum usuário encontrado",
  onEdit,
  onDelete
}: Props) {

  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  function getColumns(): ColumnDef<User>[] {
    return [
      {
        accessorKey: "pictureUrl",
        header: () => <p className="text-center">Avatar</p>,
        cell: (row) => {
          const user = row.row.original
          return (
            <div className="flex justify-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || undefined} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          )
        },
        size: 80,
      },
      {
        accessorKey: "name",
        header: () => <p className="text-start">Nome</p>,
        cell: (row) => <p className="text-start font-medium">{row.getValue() as string}</p>,
      },
      {
        accessorKey: "createdAt",
        header: () => <p className="text-center max-w-32">Data Registro</p>,
        cell: (row) => <p className="text-center text-sm max-w-32">{format(new Date(row.getValue() as string), "dd/MM/yy", {
          locale: ptBR
        })}</p>,
        size: 120,
      },
      {
        id: "actions",
        header: () => <p className="text-center">Ações</p>,
        cell: (row) => {
          const user = row.row.original

          return (
            <div className="flex justify-center items-center gap-1">
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedUser(user)}
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>

              {onEdit && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(user)}
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
              )}

              {onDelete && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(user)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          )
        },
        size: 150,
      }
    ]
  }

  return (
    <Sheet>
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
          <SheetTitle>Detalhes do Usuário</SheetTitle>
          <SheetDescription>
            Visualize as informações completas do usuário selecionado.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Nome</Label>
            <Input id="sheet-demo-name" value={selectedUser?.name} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Id de Usuário</Label>
            <Input id="sheet-demo-username" disabled value={selectedUser?.id} />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Salvar alterações</Button>
          <SheetClose asChild>
            <Button variant="outline">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}