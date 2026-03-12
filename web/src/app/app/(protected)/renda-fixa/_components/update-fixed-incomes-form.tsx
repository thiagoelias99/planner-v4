"use client"

import { FormBody, FormCurrencyInput, FormInput, FormPercentageInput, FormSelect, FormTextarea } from "@/components/form"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { EPosFixedIndex, IFixedIncome } from "@/models/fixed-income"
import { useFixedIncome } from "@/hooks/query/use-fixed-income"
import { format } from "date-fns"

const formSchema = z.object({
  description: z.string()
    .min(2, "A descrição deve conter pelo menos 2 caracteres.")
    .max(255, "A descrição deve conter no máximo 255 caracteres.")
    .optional(),
  agency: z.string()
    .max(255, "A instituição deve conter no máximo 255 caracteres.")
    .optional(),
  note: z.string()
    .max(500, "As observações devem conter no máximo 500 caracteres.")
    .optional(),
  initialInvestment: z.string()
    .refine((value) => {
      const num = parseFloat(value.replace(",", "."))
      return !isNaN(num) && num >= 0
    }, "O preço deve ser um número positivo.").optional(),
  currentValue: z.string()
    .refine((value) => {
      const num = parseFloat(value.replace(",", "."))
      return !isNaN(num) && num >= 0
    }, "O preço deve ser um número positivo.").optional(),
  date: z.string().optional(),
  dueDate: z.string().optional(),
  fixedRate: z.string()
    .refine((value) => {
      const num = parseFloat(value.replace(",", "."))
      return !isNaN(num) && num >= 0
    }, "O preço deve ser um número positivo.").optional(),
  posFixedIndex: z.enum(EPosFixedIndex, {
    message: "Selecione um índice válido.",
  }).optional(),
  retrievedAt: z.string().optional(),
})

export type UpdateFixedIncomeFormData = z.infer<typeof formSchema>

interface UpdateFixedIncomesFormProps {
  fixedIncome: IFixedIncome
  onSuccess?: (fixedIncome: UpdateFixedIncomeFormData) => void
}

export default function UpdateFixedIncomesForm({ fixedIncome, onSuccess }: UpdateFixedIncomesFormProps) {
  const { updateFixedIncome } = useFixedIncome(fixedIncome.id)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: fixedIncome.description,
      agency: fixedIncome.agency || "",
      note: fixedIncome.note || "",
      initialInvestment: fixedIncome.initialInvestment?.toString(),
      currentValue: fixedIncome.currentValue?.toString(),
      date: format(new Date(fixedIncome.date), "yyyy-MM-dd"),
      dueDate: format(new Date(fixedIncome.dueDate), "yyyy-MM-dd"),
      fixedRate: fixedIncome.fixedRate?.toString(),
      posFixedIndex: fixedIncome.posFixedIndex,
      retrievedAt: fixedIncome.retrievedAt ? format(new Date(fixedIncome.retrievedAt), "yyyy-MM-dd") : "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const submitData: {
        description?: string
        agency?: string
        note?: string
        initialInvestment?: number
        currentValue?: number
        date?: string
        dueDate?: string
        fixedRate?: number
        posFixedIndex?: EPosFixedIndex
        retrievedAt?: string
      } = {}

      if (data.description) submitData.description = data.description
      if (data.agency) submitData.agency = data.agency
      if (data.note) submitData.note = data.note
      if (data.initialInvestment) submitData.initialInvestment = parseFloat(data.initialInvestment.replace(",", "."))
      if (data.currentValue) submitData.currentValue = parseFloat(data.currentValue.replace(",", "."))
      if (data.date) submitData.date = new Date(data.date).toISOString()
      if (data.dueDate) submitData.dueDate = new Date(data.dueDate).toISOString()
      if (data.fixedRate) submitData.fixedRate = parseFloat(data.fixedRate.replace(",", "."))
      if (data.posFixedIndex) submitData.posFixedIndex = data.posFixedIndex
      if (data.retrievedAt) submitData.retrievedAt = new Date(data.retrievedAt).toISOString()

      await updateFixedIncome.mutateAsync(submitData)
      toast.success("Renda fixa atualizada com sucesso!")
      if (onSuccess) {
        onSuccess(data)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const messages = error?.response?.data?.message
        const errorMessages = Array.isArray(messages) ? messages : [messages].filter(Boolean)
        const errorMessage = errorMessages.length > 0 ? errorMessages.join("\n") : error?.message || "Erro ao atualizar renda fixa"
        toast.error(errorMessage)
        return
      }
      const err = error as Error
      const errorMessage = err?.message || "Erro ao atualizar renda fixa"
      toast.error(errorMessage)
    }
  }

  return (
    <FormBody onSubmit={form.handleSubmit(onSubmit)}>
      <FormInput
        control={form.control}
        name="description"
        label="Descrição"
        placeholder="Ex: CDB Banco XYZ 120% CDI"
      />
      <FormInput
        control={form.control}
        name="agency"
        label="Instituição Financeira"
        placeholder="Ex: Banco XYZ"
      />
      <FormTextarea
        control={form.control}
        name="note"
        label="Observações"
        placeholder="Ex: Liquidez D+1"
      />
      <div className="grid grid-cols-2 gap-4">
        <FormCurrencyInput
          control={form.control}
          name="initialInvestment"
          label="Valor Inicial (R$)"
          placeholder="Ex: 10000.00"
        />
        <FormCurrencyInput
          control={form.control}
          name="currentValue"
          label="Valor Atual (R$)"
          placeholder="Ex: 10500.00"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          control={form.control}
          name="date"
          label="Data de Início"
        />
        <FormInput
          control={form.control}
          name="dueDate"
          label="Data de Vencimento"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 w-full">
        <FormPercentageInput
          control={form.control}
          name="fixedRate"
          label="Taxa Fixa (%)"
          placeholder="Ex: 120.00"
        />
        <FormSelect
          control={form.control}
          name="posFixedIndex"
          label="Índice Pós-Fixado"
          placeholder="Selecione o índice"
          options={[
            { label: "Prefixado", value: EPosFixedIndex.NONE },
            { label: "CDI", value: EPosFixedIndex.CDI },
            { label: "IPCA", value: EPosFixedIndex.IPCA },
            { label: "IGP-M", value: EPosFixedIndex.IGPM },
            { label: "INPC", value: EPosFixedIndex.INPC },
            { label: "SELIC", value: EPosFixedIndex.SELIC },
          ]}
        />
      </div>
      <FormInput
        control={form.control}
        name="retrievedAt"
        label="Data de Atualização do Valor"
      />
      <Button type="submit" className="mt-4 w-full">Salvar</Button>
    </FormBody>
  )
}
