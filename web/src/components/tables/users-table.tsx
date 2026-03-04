"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./template/data-table"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import { Button } from "../ui/button"
import { EyeIcon } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"

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
        {selectedUser && (
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={selectedUser.image || undefined} alt={selectedUser.name} />
                <AvatarFallback className="text-lg">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="sheet-user-name">Nome</Label>
              <Input id="sheet-user-name" value={selectedUser.name} disabled />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="sheet-user-email">E-mail</Label>
              <Input id="sheet-user-email" value={selectedUser.email} disabled />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="sheet-user-id">ID</Label>
              <Input id="sheet-user-id" value={selectedUser.id} disabled />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="sheet-user-status">Status de Verificação</Label>
              <Badge variant={selectedUser.emailVerified ? "default" : "secondary"} className="w-fit">
                {selectedUser.emailVerified ? "E-mail Verificado" : "E-mail Não Verificado"}
              </Badge>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="sheet-user-created">Data de Criação</Label>
              <Input
                id="sheet-user-created"
                value={format(new Date(selectedUser.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                disabled
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="sheet-user-updated">Última Atualização</Label>
              <Input
                id="sheet-user-updated"
                value={format(new Date(selectedUser.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                disabled
              />
            </div>
          </div>
        )}
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
