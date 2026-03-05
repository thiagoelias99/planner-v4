"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { EPages } from "@/lib/routes"
import { redirect } from "next/navigation"
import { PropsWithChildren } from 'react'

export default function ProtectedLayout({ children }: PropsWithChildren) {
  const session = authClient.useSession()

  if (session.isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session.data?.session) {
    redirect(EPages.HOME)
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        // @ts-expect-error Plugin role is enabled
        sessionUser={{
          ...session.data?.user,
          image: session.data?.user?.image || undefined,
        }}

      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
