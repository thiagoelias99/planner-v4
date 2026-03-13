"use client"

import { FormBody, FormCurrencyInput, FormInput, FormSelect, FormTextarea } from "@/components/form"
import { Button } from "@/components/ui/button"
import { useOtherAssets } from "@/hooks/query/use-other-assets"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { EOtherAssetType } from "@/models/other-asset"

const formSchema = z.object({
  description: z.string()
    .min(1, "A descrição é obrigatória.")
    .max(255, "A descrição deve conter no máximo 255 caracteres."),
  agency: z.string()
    .max(255, "A agência deve conter no máximo 255 caracteres.")
    .optional(),
  note: z.string()
    .max(500, "A nota deve conter no máximo 500 caracteres.")
    .optional(),
  type: z.enum([EOtherAssetType.CASH_BOX, EOtherAssetType.PENSION, EOtherAssetType.PROPERTY, EOtherAssetType.OTHER], {
    message: "Selecione um tipo válido.",
  }),
  value: z.string()
    .min(1, "O valor é obrigatório.")
    .refine((value) => {
      const num = parseFloat(value.replace(",", "."))
      return !isNaN(num) && num >= 0
    }, "O valor deve ser um número positivo."),
})

export type CreateOtherAssetFormData = z.infer<typeof formSchema>

interface CreateOtherAssetsFormProps {
  onSuccess?: (asset: CreateOtherAssetFormData) => void
}

export default function CreateOtherAssetsForm({ onSuccess }: CreateOtherAssetsFormProps) {
  const { createOtherAsset } = useOtherAssets()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      agency: "",
      note: "",
      type: EOtherAssetType.CASH_BOX,
      value: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const submitData = {
        description: data.description,
        agency: data.agency || undefined,
        note: data.note || undefined,
        type: data.type,
        value: parseFloat(data.value.replace(",", ".")),
      }
      
      await createOtherAsset.mutateAsync(submitData)
      form.reset()
      toast.success("Ativo criado com sucesso!")
      if (onSuccess) {
        onSuccess(data)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const messages = error?.response?.data?.message
        const errorMessages = Array.isArray(messages) ? messages : [messages].filter(Boolean)
        const errorMessage = errorMessages.length > 0 ? errorMessages.join("\n") : error?.message || "Erro ao criar ativo"
        toast.error(errorMessage)
        return
      }
      const err = error as Error
      const errorMessage = err?.message || "Erro ao criar ativo"
      toast.error(errorMessage)
    }
  }

  return (
    <FormBody onSubmit={form.handleSubmit(onSubmit)}>
      <FormInput
        control={form.control}
        name="description"
        label="Descrição"
        placeholder="Ex: Reserva de Emergência"
      />
      
      <FormInput
        control={form.control}
        name="agency"
        label="Agência/Corretora (Opcional)"
        placeholder="Ex: Nubank"
      />

      <FormSelect
        control={form.control}
        name="type"
        label="Tipo"
        placeholder="Selecione o tipo"
        options={[
          { label: "Caixinha", value: EOtherAssetType.CASH_BOX },
          { label: "Previdência", value: EOtherAssetType.PENSION },
          { label: "Imóvel", value: EOtherAssetType.PROPERTY },
          { label: "Outros", value: EOtherAssetType.OTHER },
        ]}
      />

      <FormCurrencyInput
        control={form.control}
        name="value"
        label="Valor Atual (R$)"
        placeholder="Ex: 5000,00"
      />

      <FormTextarea
        control={form.control}
        name="note"
        label="Observações (Opcional)"
        placeholder="Anotações adicionais sobre o ativo..."
      />

      <Button type="submit" className="mt-4 w-full" disabled={createOtherAsset.isPending}>
        {createOtherAsset.isPending ? "Salvando..." : "Salvar"}
      </Button>
    </FormBody>
  )
}
