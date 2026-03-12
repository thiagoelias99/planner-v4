"use client"

import { FormBody, FormCurrencyInput, FormInput, FormNumberInput, FormSelect } from "@/components/form"
import { Button } from "@/components/ui/button"
import { useTickerOrders } from "@/hooks/query/use-ticker-orders"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { ETickerOrderType } from "@/models/ticker-order"

const formSchema = z.object({
  ticker: z.string()
    .min(1, "O ticker é obrigatório.")
    .max(20, "O ticker deve conter no máximo 20 caracteres.")
    .regex(/^[A-Za-z0-9]+$/, "O ticker deve conter apenas letras e números sem espaços."),
  type: z.enum(ETickerOrderType, {
    message: "Selecione um tipo válido.",
  }),
  quantity: z.number().positive("A quantidade deve ser um número positivo.").int("A quantidade deve ser um número inteiro."),
  price: z.string()
    .refine((value) => {
      const num = parseFloat(value.replace(",", "."))
      return !isNaN(num) && num >= 0
    }, "O preço deve ser um número positivo.")
})

export type CreateTickerOrderFormData = z.infer<typeof formSchema>

interface CreateTickerOrdersFormProps {
  onSuccess?: (tickerOrder: CreateTickerOrderFormData) => void
}

export default function CreateTickerOrdersForm({ onSuccess }: CreateTickerOrdersFormProps) {
  const { createTickerOrder } = useTickerOrders()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "",
      type: ETickerOrderType.BUY,
      quantity: 0,
      price: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // Convert strings to numbers
      const submitData = {
        ticker: data.ticker,
        type: data.type,
        quantity: data.quantity,
        price: parseFloat(data.price.replace(",", ".")),
      }
      await createTickerOrder.mutateAsync(submitData)
      form.reset()
      toast.success("Ordem criada com sucesso!")
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
        if (errorText.toLowerCase().includes("ticker")) {
          toast.error("O ticker é inválido.")
          form.setError("ticker", { message: "O ticker é inválido." })
          return
        }
        if (errorText.toLowerCase().includes("quantity")) {
          toast.error("A quantidade é inválida.")
          form.setError("quantity", { message: "A quantidade é inválida." })
          return
        }
        if (errorText.toLowerCase().includes("price")) {
          toast.error("O preço é inválido.")
          form.setError("price", { message: "O preço é inválido." })
          return
        }

        const errorMessage = errorMessages.length > 0 ? errorMessages.join("\n") : error?.message || "Erro ao criar ordem"
        toast.error(errorMessage)
        return
      }
      const err = error as Error

      const errorMessage = err?.message || "Erro ao criar ordem"
      toast.error(errorMessage)
    }
  }

  return (
    <FormBody
      onSubmit={form.handleSubmit(onSubmit)}>
      <FormInput
        control={form.control}
        name="ticker"
        label="Ticker"
        placeholder="Ex: PETR4"
      />
      <FormSelect
        control={form.control}
        name="type"
        label="Tipo"
        placeholder="Selecione o tipo"
        options={[
          { label: "Compra", value: ETickerOrderType.BUY },
          { label: "Venda", value: ETickerOrderType.SELL },
        ]}
      />
      <FormNumberInput
        control={form.control}
        name="quantity"
        label="Quantidade"
        placeholder="Ex: 100"
      />
      <FormCurrencyInput
        control={form.control}
        name="price"
        label="Preço"
        placeholder="Ex: 40.92"
      />
      <Button type="submit" className="mt-4">Salvar</Button>
    </FormBody>
  )
}
