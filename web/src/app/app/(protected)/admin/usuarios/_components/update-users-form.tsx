
"use client"

import { FormBody, FormInput, FormSelect, FormSwitch } from "@/components/form"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { EUserRole, IUser } from "@/models/user"
import { useUser } from "@/hooks/query/use-user"

const formSchema = z.object({
  name: z.string().min(2, "O nome deve conter pelo menos 2 caracteres.").max(50, "O nome deve conter no máximo 50 caracteres.").optional(),
  email: z.email("Insira um endereço de e-mail válido.").optional(),
  emailVerified: z.boolean().optional(),
  image: z.url("Insira uma URL válida.").optional().or(z.literal("")),
  role: z.enum(EUserRole).optional(),
})

export type UpdateUserFormData = z.infer<typeof formSchema>

interface UpdateUsersFormProps {
  user: IUser
  onSuccess?: (user: UpdateUserFormData) => void
}

export default function UpdateUsersForm({ user, onSuccess }: UpdateUsersFormProps) {
  const { updateUser, requestPasswordReset } = useUser(user.id)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image || undefined,
      role: user.role,
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await updateUser.mutateAsync(data)
      form.reset()
      toast.success("Usuário atualizado com sucesso!")
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
        if (errorText.toLowerCase().includes("email")) {
          toast.error("O e-mail já está em uso.")
          form.setError("email", { message: "O e-mail já está em uso." })
          return
        }

        const errorMessage = errorMessages.length > 0 ? errorMessages.join("\n") : error?.message || "Erro ao atualizar usuário"
        toast.error(errorMessage) // Substituir por um toast/notification mais adequado
        return
      }
      const err = error as Error

      const errorMessage = err?.message || "Erro ao atualizar usuário"
      toast.error(errorMessage) // Substituir por um toast/notification mais adequado
    }
  }

  async function handleRequestPasswordReset() {
    try {
      await requestPasswordReset.mutateAsync({ id: user.id })
      toast.success("E-mail de redefinição de senha enviado com sucesso!")
    } catch (error) {
      const err = error as Error
      const errorMessage = err?.message || "Erro ao solicitar redefinição de senha"
      toast.error(errorMessage) // Substituir por um toast/notification mais adequado
    }
  }

  return (
    <FormBody onSubmit={form.handleSubmit(onSubmit)}>
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
      <FormSwitch
        control={form.control}
        name="emailVerified"
        label="E-mail Verificado"
        description="Indica se o e-mail do usuário foi verificado"
      />
      <FormInput
        control={form.control}
        name="image"
        label="URL da Imagem"
        placeholder="https://exemplo.com/avatar.jpg"
      />
      <FormSelect
        control={form.control}
        name="role"
        label="Função"
        placeholder="Selecione a função"
        options={[
          { label: "Usuário", value: EUserRole.USER },
          { label: "Administrador", value: EUserRole.ADMIN },
        ]}
      />
      <Button type="submit" className="mt-4 w-full">Salvar</Button>
      <Button type="button" variant="outline" className="mt-4 w-full" onClick={handleRequestPasswordReset}>Resetar Senha</Button>
    </FormBody>
  )
}
