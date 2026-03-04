"use client"

import Link from "next/link"
import { EPages } from "@/lib/routes"
import Image from "next/image"
import { redirect } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function AuthPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = authClient.useSession()

  if (session.data?.session) {
    redirect(EPages.DASHBOARD)
  }

  return (
    <div className="w-full bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href={EPages.HOME} className="w-full flex justify-center items-center space-x-2">
          <Image
            src="/logo/logo-h-light.png"
            width={200}
            height={40}
            alt="Picture of the author"
            className="dark:hidden"
          />
          <Image
            src="/logo/logo-h-dark.png"
            width={200}
            height={40}
            alt="Picture of the author"
            className="hidden dark:inline-block"
          />
        </Link>
        {children}
        <p className="w-full px-6 text-center text-muted-foreground">
          Ao clicar em continuar, você concorda com nossos <a href={EPages.TERMS_OF_SERVICE} className="underline">Termos de Serviço</a>{" "}
          e <a href={EPages.PRIVACY_POLICY} className="underline">Política de Privacidade</a>.
        </p>
      </div>
    </div>
  )
}