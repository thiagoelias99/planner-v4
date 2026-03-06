"use client"

import { FormBody, FormInput, FormSelect, FormSwitch } from "@/components/form"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { ETickerType, ITicker } from "@/models/ticker"
import { useTicker } from "@/hooks/query/use-ticker"

const formSchema = z.object({
  name: z.string()
    .min(2, "O nome deve conter pelo menos 2 caracteres.")
    .max(100, "O nome deve conter no máximo 100 caracteres.")
    .optional(),
  type: z.nativeEnum(ETickerType, {
    message: "Selecione um tipo válido.",
  }).optional(),
  price: z.string().optional(),
  autoUpdate: z.boolean().optional(),
})

export type UpdateTickerFormData = z.infer<typeof formSchema>

interface UpdateTickersFormProps {
  ticker: ITicker
  onSuccess?: (ticker: UpdateTickerFormData) => void
}

export default function UpdateTickersForm({ ticker, onSuccess }: UpdateTickersFormProps) {
  const { updateTicker } = useTicker(ticker.id)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ticker.name,
      type: ticker.type,
      price: ticker.price?.toString(),
      autoUpdate: ticker.autoUpdate,
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // Convert price string to number if provided
      const submitData: { name?: string; type?: ETickerType; price?: number; autoUpdate?: boolean } = {
        name: data.name,
        type: data.type,
        price: data.price && data.price !== "" ? parseFloat(data.price) : undefined,
        autoUpdate: data.autoUpdate,
      }
      await updateTicker.mutateAsync(submitData)
      form.reset()
      toast.success("Ticker atualizado com sucesso!")
      if (onSuccess) {
        onSuccess(data)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const messages = error?.response?.data?.message

        // Normalizar mensagens para array
        const errorMessages = Array.isArray(messages) ? messages : [messages].filter(Boolean)

        const errorMessage = errorMessages.length > 0 ? errorMessages.join("\n") : error?.message || "Erro ao atualizar ticker"
        toast.error(errorMessage)
        return
      }
      const err = error as Error

      const errorMessage = err?.message || "Erro ao atualizar ticker"
      toast.error(errorMessage)
    }
  }

  return (
    <FormBody onSubmit={form.handleSubmit(onSubmit)}>
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
        label="Preço"
        placeholder="Ex: 40.92"
      />
      <FormSwitch
        control={form.control}
        name="autoUpdate"
        label="Atualização Automática"
        description="Habilitar atualização automática do preço"
      />
      <Button type="submit" className="mt-4 w-full">Salvar</Button>
    </FormBody>
  )
}
