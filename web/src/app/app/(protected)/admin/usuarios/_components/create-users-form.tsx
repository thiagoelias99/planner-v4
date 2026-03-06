
"use client"

import { FormInput } from "@/components/form"
import { Button } from "@/components/ui/button"
import { useUsers } from "@/hooks/query/use-users"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, "O nome deve conter pelo menos 2 caracteres.").max(50, "O nome deve conter no máximo 50 caracteres."),
  email: z.email("Insira um endereço de e-mail válido."),
  password: z.string().min(8, "A senha deve conter pelo menos 8 caracteres.").max(100, "A senha deve conter no máximo 100 caracteres."),
})

export type CreateUserFormData = z.infer<typeof formSchema>

interface CreateUsersFormProps {
  onSuccess?: (user: CreateUserFormData) => void
}

export default function CreateUsersForm({ onSuccess }: CreateUsersFormProps) {
  const { createUser } = useUsers()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await createUser.mutateAsync(data)
      form.reset()
      toast.success("Usuário criado com sucesso!")
      if (onSuccess) {
        onSuccess(data)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const messages = error?.response?.data?.message

        // Normalizar mensagens para array
        const errorMessages = Array.isArray(messages) ? messages : [messages].filter(Boolean)
        const errorText = errorMessages.join(", ")

        // Verificar tipos específicos de erro
        if (errorText.toLowerCase().includes("password")) {
          toast.error("A senha não é segura o suficiente.")
          form.setError("password", { message: "A senha não é segura o suficiente." })
          return
        }
        if (errorText.toLowerCase().includes("email")) {
          toast.error("O e-mail já está em uso.")
          form.setError("email", { message: "O e-mail já está em uso." })
          return
        }

        const errorMessage = errorMessages.length > 0 ? errorMessages.join("\n") : error?.message || "Erro ao criar usuário"
        toast.error(errorMessage) // Substituir por um toast/notification mais adequado
        return
      }
      const err = error as Error

      const errorMessage = err?.message || "Erro ao criar usuário"
      toast.error(errorMessage) // Substituir por um toast/notification mais adequado
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4 justify-start items-start"
    >
      <FormInput
        control={form.control}
        name="name"
        label="Nome"
        placeholder="Digite o nome"
      />
      <FormInput
        control={form.control}
        name="email"
        label="E-mail"
        placeholder="Digite o e-mail"
      />
      <FormInput
        control={form.control}
        name="password"
        label="Senha"
        placeholder="Digite a senha"
        type="password"
      />
      <Button type="submit" className="mt-4">Salvar</Button>
    </form>
  )
}
