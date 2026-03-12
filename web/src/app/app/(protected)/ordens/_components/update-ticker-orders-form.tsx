"use client"

import { FormBody, FormCurrencyInput, FormInput, FormSelect } from "@/components/form"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { ETickerOrderType, ITickerOrder } from "@/models/ticker-order"
import { useTickerOrder } from "@/hooks/query/use-ticker-order"
import { Trash2Icon } from "lucide-react"

const formSchema = z.object({
  ticker: z.string()
    .min(1, "O ticker é obrigatório.")
    .max(20, "O ticker deve conter no máximo 20 caracteres.")
    .regex(/^[A-Za-z0-9]+$/, "O ticker deve conter apenas letras e números sem espaços.")
    .optional(),
  type: z.enum(ETickerOrderType, {
    message: "Selecione um tipo válido.",
  }).optional(),
  quantity: z.string()
    .regex(/^\d+$/, "A quantidade deve ser um número inteiro positivo.")
    .optional(),
  price: z.string()
    .refine((value) => {
      const num = parseFloat(value.replace(",", "."))
      return !isNaN(num) && num >= 0
    }, "O preço deve ser um número positivo."),
})

export type UpdateTickerOrderFormData = z.infer<typeof formSchema>

interface UpdateTickerOrdersFormProps {
  tickerOrder: ITickerOrder
  onSuccess?: (tickerOrder: UpdateTickerOrderFormData) => void
  onDelete?: () => void
}

export default function UpdateTickerOrdersForm({ tickerOrder, onSuccess, onDelete }: UpdateTickerOrdersFormProps) {
  const { updateTickerOrder, deleteTickerOrder } = useTickerOrder(tickerOrder.id)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: tickerOrder.ticker,
      type: tickerOrder.type,
      quantity: tickerOrder.quantity.toString(),
      price: tickerOrder.price.toString(),
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // Convert strings to numbers if provided
      const submitData: {
        type?: ETickerOrderType
        quantity?: number
        price?: number
      } = {}

      if (data.type) submitData.type = data.type
      if (data.quantity) submitData.quantity = parseInt(data.quantity)
      if (data.price) submitData.price = parseFloat(data.price.replace(",", "."))

      await updateTickerOrder.mutateAsync(submitData)
      toast.success("Ordem atualizada com sucesso!")
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

        const errorMessage = errorMessages.length > 0 ? errorMessages.join("\n") : error?.message || "Erro ao atualizar ordem"
        toast.error(errorMessage)
        return
      }
      const err = error as Error

      const errorMessage = err?.message || "Erro ao atualizar ordem"
      toast.error(errorMessage)
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir esta ordem? Esta ação não pode ser desfeita.")) {
      return
    }

    try {
      await deleteTickerOrder.mutateAsync()
      toast.success("Ordem excluída com sucesso!")
      if (onDelete) {
        onDelete()
      }
    } catch (error) {
      const err = error as Error
      const errorMessage = err?.message || "Erro ao excluir ordem"
      toast.error(errorMessage)
    }
  }

  return (
    <FormBody onSubmit={form.handleSubmit(onSubmit)}>
      <FormInput
        control={form.control}
        name="ticker"
        label="Ticker"
        placeholder="Ex: PETR4"
        disabled
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
      <FormInput
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
      <Button type="submit" className="mt-4 w-full">Salvar</Button>

      <Button
        type="button"
        variant="destructive"
        className="mt-2 w-full"
        onClick={handleDelete}
        disabled={deleteTickerOrder.isPending}
      >
        <Trash2Icon className="h-4 w-4 mr-2" />
        {deleteTickerOrder.isPending ? "Excluindo..." : "Excluir Ordem"}
      </Button>
    </FormBody>
  )
}

