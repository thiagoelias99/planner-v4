"use client"

import { FormBody, FormInput, FormSelect } from "@/components/form"
import { Button } from "@/components/ui/button"
import { useTickers } from "@/hooks/query/use-tickers"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { ETickerType } from "@/models/ticker"

const formSchema = z.object({
  symbol: z.string()
    .min(1, "O símbolo é obrigatório.")
    .max(20, "O símbolo deve conter no máximo 20 caracteres.")
    .regex(/^[A-Za-z0-9]+$/, "O símbolo deve conter apenas letras e números sem espaços."),
  name: z.string()
    .min(2, "O nome deve conter pelo menos 2 caracteres.")
    .max(100, "O nome deve conter no máximo 100 caracteres."),
  type: z.nativeEnum(ETickerType, {
    message: "Selecione um tipo válido.",
  }),
  price: z.string().optional(),
})

export type CreateTickerFormData = z.infer<typeof formSchema>

interface CreateTickersFormProps {
  onSuccess?: (ticker: CreateTickerFormData) => void
}

export default function CreateTickersForm({ onSuccess }: CreateTickersFormProps) {
  const { createTicker } = useTickers()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      name: "",
      type: ETickerType.STOCK,
      price: undefined,
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // Convert price string to number if provided
      const submitData: { symbol: string; name: string; type: ETickerType; price?: number } = {
        symbol: data.symbol,
        name: data.name,
        type: data.type,
        price: data.price && data.price !== "" ? parseFloat(data.price) : undefined,
      }
      await createTicker.mutateAsync(submitData)
      form.reset()
      toast.success("Ticker criado com sucesso!")
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
        if (errorText.toLowerCase().includes("symbol")) {
          toast.error("O símbolo já está em uso ou é inválido.")
          form.setError("symbol", { message: "O símbolo já está em uso ou é inválido." })
          return
        }

        const errorMessage = errorMessages.length > 0 ? errorMessages.join("\n") : error?.message || "Erro ao criar ticker"
        toast.error(errorMessage)
        return
      }
      const err = error as Error

      const errorMessage = err?.message || "Erro ao criar ticker"
      toast.error(errorMessage)
    }
  }

  return (
    <FormBody
      onSubmit={form.handleSubmit(onSubmit)}>
      <FormInput
        control={form.control}
        name="symbol"
        label="Símbolo"
        placeholder="Ex: PETR4"
      />
      <FormInput
        control={form.control}
        name="name"
        label="Nome"
        placeholder="Ex: Petrobras"
      />
      <FormSelect
        control={form.control}
        name="type"
        label="Tipo"
        placeholder="Selecione o tipo"
        options={[
          { label: "Ação", value: ETickerType.STOCK },
          { label: "ETF", value: ETickerType.ETF },
          { label: "FII", value: ETickerType.REIT },
          { label: "Ouro", value: ETickerType.GOLD },
          { label: "Cripto", value: ETickerType.CRYPTO },
          { label: "Internacional", value: ETickerType.INTERNATIONAL },
        ]}
      />
      <FormInput
        control={form.control}
        name="price"
        label="Preço (opcional)"
        placeholder="Ex: 40.92"
      />
      <Button type="submit" className="mt-4">Salvar</Button>
    </FormBody>
  )
}
