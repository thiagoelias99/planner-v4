"use client"

import { Button } from "./ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function CookiesNotification() {
  const { storedValue, setValue } = useLocalStorage("acceptedCookies", false)
  const [hide, setHide] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHide(!!storedValue)
  }, [storedValue])

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 md:left-8 md:right-8 z-50 transition-all duration-500 ease-in-out",
        hide ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      )}
    >
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center md:text-left flex-1">
          Utilizamos cookies para personalizar conteúdo e anúncios, oferecer recursos de mídia social e analisar nosso tráfego.{" "}
          <Link href="/politica-de-privacidade" className="underline font-medium hover:text-primary">
            Saiba mais
          </Link>
        </p>
        <div className="flex-shrink-0 w-full md:w-auto flex gap-2 justify-center">
          <Button
            onClick={() => setValue(true)}
            className="w-full md:w-auto"
          >
            Aceitar Cookies
          </Button>
        </div>
      </div>
    </div>
  )
}