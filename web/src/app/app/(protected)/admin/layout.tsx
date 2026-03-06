"use client"

import { authClient } from "@/lib/auth-client"
import { EPages } from "@/lib/routes"
import { EUserRole } from "@/models/user"
import { redirect } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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

  // @ts-expect-error - Role Plugin
  if (!session.data?.session || (session.data?.user?.role !== EUserRole.ADMIN)) {
    redirect(EPages.DASHBOARD)
  }

  return (
    <>
      {children}
    </>
  )
}