"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { eUserRoleMapper, IUser } from "@/models/user"
import { Edit2Icon } from "lucide-react"
import { SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
  data?: IUser[]
  isLoading?: boolean
  emptyMessage?: string
  onEdit: (user: IUser) => void
}

export default function MobileUsersTable({
  data = [],
  isLoading = false,
  emptyMessage = "Nenhum usuário encontrado",
  onEdit
}: Props) {

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
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
      {data.map((user) => {
        const roleInfo = eUserRoleMapper[user.role]

        return (
          <Card key={user.id} className="gap-1.5">
            <CardHeader className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.image || undefined} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{user.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => onEdit(user)}
                >
                  <Edit2Icon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            </CardHeader>

            <CardContent className="flex items-center gap-2 flex-wrap">
              <Badge variant={roleInfo.variant}>
                {roleInfo.label}
              </Badge>
              <Badge variant={user.emailVerified ? "default" : "secondary"}>
                {user.emailVerified ? "Verificado" : "Não Verificado"}
              </Badge>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
