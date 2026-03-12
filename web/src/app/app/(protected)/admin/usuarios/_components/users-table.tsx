"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "../../../../../../components/tables/template/data-table"
import { Button } from "../../../../../../components/ui/button"
import { Edit2Icon } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../../components/ui/avatar"
import { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../../../../../../components/ui/sheet"
import { Badge } from "../../../../../../components/ui/badge"
import UpdateUsersForm from "./update-users-form"
import { EUserRole, eUserRoleMapper, IUser } from "@/models/user"
import MobileUsersTable from "./mobile-users-table"

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

  const [isSheetOpen, setIsSheetOpen] = useState(false)
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
        accessorKey: "role",
        header: () => <p className="text-center">Função</p>,
        cell: (row) => {
          const role = row.getValue() as EUserRole
          const roleInfo = eUserRoleMapper[role]
          return (
            <div className="flex justify-center">
              <Badge variant={roleInfo.variant}>
                {roleInfo.label}
              </Badge>
            </div>
          )
        },
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
                  onClick={() => {
                    setSelectedUser(user)
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
          <div className="hidden sm:block">
            <DataTable
              columns={getColumns()}
              data={data}
              isLoading={isLoading}
              emptyMessage={emptyMessage}
            />
          </div>
          <div className="sm:hidden">
            <MobileUsersTable
              data={data}
              isLoading={isLoading}
              emptyMessage={emptyMessage}
              onEdit={(user) => {
                setSelectedUser(user)
                setIsSheetOpen(true)
              }}
            />
          </div>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detalhes do Usuário</SheetTitle>
          <SheetDescription>
            Visualize as informações completas do usuário selecionado.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          {selectedUser && <UpdateUsersForm user={selectedUser} onSuccess={() => setIsSheetOpen(false)} />}
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
