"use client"

import { FormBody, FormCurrencyInput, FormInput, FormSelect, FormTextarea } from "@/components/form"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { EOtherAssetType, IOtherAsset } from "@/models/other-asset"
import { useOtherAsset } from "@/hooks/query/use-other-asset"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Trash2Icon } from "lucide-react"

const formSchema = z.object({
  description: z.string()
    .min(1, "A descrição é obrigatória.")
    .max(255, "A descrição deve conter no máximo 255 caracteres.")
    .optional(),
  agency: z.string()
    .max(255, "A agência deve conter no máximo 255 caracteres.")
    .optional(),
  note: z.string()
    .max(500, "A nota deve conter no máximo 500 caracteres.")
    .optional(),
  type: z.enum([EOtherAssetType.CASH_BOX, EOtherAssetType.PENSION, EOtherAssetType.PROPERTY, EOtherAssetType.OTHER], {
    message: "Selecione um tipo válido.",
  }).optional(),
  value: z.string()
    .refine((value) => {
      const num = parseFloat(value.replace(",", "."))
      return !isNaN(num) && num >= 0
    }, "O valor deve ser um número positivo.").optional(),
})

export type UpdateOtherAssetFormData = z.infer<typeof formSchema>

interface UpdateOtherAssetsFormProps {
  asset: IOtherAsset
  onSuccess?: (asset: UpdateOtherAssetFormData) => void
  onDeleted?: () => void
}

export default function UpdateOtherAssetsForm({ asset, onSuccess, onDeleted }: UpdateOtherAssetsFormProps) {
  const { updateOtherAsset, deleteOtherAsset } = useOtherAsset(asset.id)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: asset.description,
      agency: asset.agency || "",
      note: asset.note || "",
      type: asset.type,
      value: asset.value?.toString(),
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const submitData = {
        description: data.description,
        agency: data.agency || undefined,
        note: data.note || undefined,
        type: data.type,
        value: data.value ? parseFloat(data.value.replace(",", ".")) : undefined,
      }

      await updateOtherAsset.mutateAsync(submitData)
      form.reset()
      toast.success("Ativo atualizado com sucesso!")
      if (onSuccess) onSuccess(data)
    } catch (error) {
      if (error instanceof AxiosError) {
        const messages = error?.response?.data?.message
        const errorMessages = Array.isArray(messages) ? messages : [messages].filter(Boolean)
        const errorMessage = errorMessages.length > 0 ? errorMessages.join("\n") : error?.message || "Erro ao atualizar ativo"
        toast.error(errorMessage)
        return
      }
      const err = error as Error
      toast.error(err?.message || "Erro ao atualizar ativo")
    }
  }

  async function handleDelete() {
    try {
      await deleteOtherAsset.mutateAsync(asset.id)
      toast.success("Ativo excluído com sucesso!")
      if (onDeleted) onDeleted()
    } catch (error) {
      toast.error("Erro ao excluir ativo")
    }
  }

  return (
    <div className="flex flex-col h-full">
      <FormBody onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
        <FormInput
          control={form.control}
          name="description"
          label="Descrição"
        />

        <FormInput
          control={form.control}
          name="agency"
          label="Agência/Corretora (Opcional)"
        />

        <FormSelect
          control={form.control}
          name="type"
          label="Tipo"
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
        />

        <FormTextarea
          control={form.control}
          name="note"
          label="Observações (Opcional)"
        />

        <Button type="submit" className="mt-4 w-full" disabled={updateOtherAsset.isPending}>
          {updateOtherAsset.isPending ? "Atualizando..." : "Salvar Alterações"}
        </Button>
      </FormBody>

      <div className="mt-8 border-t pt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full" disabled={deleteOtherAsset.isPending}>
              <Trash2Icon className="mr-2 h-4 w-4" />
              {deleteOtherAsset.isPending ? "Excluindo..." : "Excluir Ativo"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente o ativo e removerá seus dados de nossos servidores.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Sim, Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
