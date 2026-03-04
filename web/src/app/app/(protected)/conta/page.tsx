"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconCalendar, IconCheck, IconMail, IconPalette, IconUser, IconX } from "@tabler/icons-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { UpdateNameForm } from "./update-name-form"
import { useProfile } from "@/hooks/query/use-profile"
import { ThemeSelector } from "@/components/theme-selector"

export default function UserAccountPage() {
  const { data: profile, isLoading } = useProfile()

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Carregando perfil...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Seção de Dados Pessoais */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUser className="size-5" />
              Dados Pessoais
            </CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UpdateNameForm currentName={profile.name} />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconMail className="size-4" />
                <span>Email</span>
              </div>
              <p className="font-medium">{profile.email}</p>
              <div className="flex items-center gap-2">
                {profile.emailVerified ? (
                  <Badge variant="default" className="gap-1">
                    <IconCheck className="size-3" />
                    Verificado
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <IconX className="size-3" />
                    Não verificado
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconCalendar className="size-4" />
                <span>Membro desde</span>
              </div>
              <p className="font-medium">
                {format(new Date(profile.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconPalette className="size-5" />
              Aparência
            </CardTitle>
            <CardDescription>
              Personalize o tema da interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSelector />
          </CardContent>
        </Card>

        {/* Seção de Contas Vinculadas */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Contas Vinculadas</CardTitle>
            <CardDescription>
              Provedores de autenticação conectados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile.accounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma conta vinculada
              </p>
            ) : (
              <div className="space-y-3">
                {profile.accounts.map((account: Account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="font-medium capitalize">
                        {account.providerId === "credential" ? "Email e Senha" : account.providerId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Conectado em {format(new Date(account.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <Badge variant="outline">Ativo</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}
