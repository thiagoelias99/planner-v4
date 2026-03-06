"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "../../../../../../components/tables/template/data-table"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import { Button } from "../../../../../../components/ui/button"
import { EyeIcon } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../../components/ui/avatar"
import { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../../../../../../components/ui/sheet"
import { Badge } from "../../../../../../components/ui/badge"
import CreateUsersForm from "./create-users-form"

interface IUser {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string | null
  createdAt: string | Date
  updatedAt: string | Date
}

interface Props {
  data?: IUser[]
  isLoading?: boolean
  emptyMessage?: string
}

export default function UsersTable({
  data = [],
  isLoading = false,
  emptyMessage = "Nenhum usuário encontrado"
}: Props) {

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

  function getColumns(): ColumnDef<IUser>[] {
    return [
      {
        accessorKey: "image",
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
        accessorKey: "email",
        header: () => <p className="text-start">E-mail</p>,
        cell: (row) => <p className="text-start text-sm text-muted-foreground">{row.getValue() as string}</p>,
      },
      {
        accessorKey: "emailVerified",
        header: () => <p className="text-center">Status</p>,
        cell: (row) => {
          const verified = row.getValue() as boolean
          return (
            <div className="flex justify-center">
              <Badge variant={verified ? "default" : "secondary"}>
                {verified ? "Verificado" : "Não Verificado"}
              </Badge>
            </div>
          )
        },
        size: 120,
      },
      {
        accessorKey: "createdAt",
        header: () => <p className="text-center">Data Registro</p>,
        cell: (row) => <p className="text-center text-sm">{format(new Date(row.getValue() as string), "dd/MM/yy", {
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
            </div>
          )
        },
        size: 100,
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
        <SheetBody>
          <CreateUsersForm />
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
