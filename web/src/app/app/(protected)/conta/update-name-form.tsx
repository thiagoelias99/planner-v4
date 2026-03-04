"use client"

import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IconCheck, IconUser } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface UpdateNameFormProps {
  currentName: string
}

export function UpdateNameForm({ currentName }: UpdateNameFormProps) {
  const router = useRouter()
  const [name, setName] = useState(currentName)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (name === currentName) {
      toast.info("Nenhuma alteração foi feita")
      return
    }

    setIsLoading(true)

    toast.success("Nome atualizado com sucesso!")
    setIsLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <IconUser className="size-4" />
          <span>Nome</span>
        </div>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          required
          minLength={2}
        />
      </Field>

      <Button
        type="submit"
        disabled={isLoading || name === currentName}
        className="gap-2"
      >
        <IconCheck className="size-4" />
        {isLoading ? "Atualizando..." : "Atualizar Nome"}
      </Button>
    </form>
  )
}
