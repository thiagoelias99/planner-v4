"use client"

import { FormBody, FormCurrencyInput, FormDateInput, FormInput, FormPercentageInput, FormSelect, FormTextarea } from "@/components/form"
import { Button } from "@/components/ui/button"
import { useFixedIncomes } from "@/hooks/query/use-fixed-incomes"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { EPosFixedIndex } from "@/models/fixed-income"
import { addHours, format } from "date-fns"

const formSchema = z.object({
  description: z.string()
    .min(2, "A descrição deve conter pelo menos 2 caracteres.")
    .max(255, "A descrição deve conter no máximo 255 caracteres."),
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
    }, "O preço deve ser um número positivo."),
  currentValue: z.string()
    .refine((value) => {
      const num = parseFloat(value.replace(",", "."))
      return !isNaN(num) && num >= 0
    }, "O preço deve ser um número positivo."),
  date: z.string(),
  dueDate: z.string(),
  fixedRate: z.string()
    .refine((value) => {
      const num = parseFloat(value.replace(",", "."))
      return !isNaN(num) && num >= 0
    }, "O preço deve ser um número positivo."),
  posFixedIndex: z.enum(EPosFixedIndex, {
    message: "Selecione um índice válido.",
  }),
  retrievedAt: z.string().optional(),
})

export type CreateFixedIncomeFormData = z.infer<typeof formSchema>

interface CreateFixedIncomesFormProps {
  onSuccess?: (fixedIncome: CreateFixedIncomeFormData) => void
}

export default function CreateFixedIncomesForm({ onSuccess }: CreateFixedIncomesFormProps) {
  const { createFixedIncome } = useFixedIncomes()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      agency: "",
      note: "",
      initialInvestment: "",
      currentValue: "",
      date: format(new Date(), "yyyy-MM-dd"),
      dueDate: format(new Date(), "yyyy-MM-dd"),
      fixedRate: "0",
      posFixedIndex: EPosFixedIndex.CDI,
      retrievedAt: undefined,
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const submitData = {
        description: data.description,
        agency: data.agency || undefined,
        note: data.note || undefined,
        initialInvestment: parseFloat(data.initialInvestment.replace(",", ".")),
        currentValue: parseFloat(data.currentValue.replace(",", ".")),
        date: addHours(new Date(data.date), 12).toISOString(),
        dueDate: addHours(new Date(data.dueDate), 12).toISOString(),
        fixedRate: parseFloat(data.fixedRate.replace(",", ".")),
        posFixedIndex: data.posFixedIndex,
        retrievedAt: data.retrievedAt ? addHours(new Date(data.retrievedAt), 12).toISOString() : undefined,
      }

      await createFixedIncome.mutateAsync(submitData)
      form.reset()
      toast.success("Renda fixa criada com sucesso!")
      if (onSuccess) {
        onSuccess(data)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const messages = error?.response?.data?.message
        const errorMessages = Array.isArray(messages) ? messages : [messages].filter(Boolean)
        const errorMessage = errorMessages.length > 0 ? errorMessages.join("\n") : error?.message || "Erro ao criar renda fixa"
        toast.error(errorMessage)
        return
      }
      const err = error as Error
      const errorMessage = err?.message || "Erro ao criar renda fixa"
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
      <div className="grid grid-cols-2 gap-4 w-full">
        <FormDateInput
          control={form.control}
          name="date"
          label="Data do Aporte"
        />
        <FormDateInput
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
            { label: "Nenhum", value: EPosFixedIndex.NONE },
            { label: "CDI", value: EPosFixedIndex.CDI },
            { label: "IPCA", value: EPosFixedIndex.IPCA },
            { label: "IGP-M", value: EPosFixedIndex.IGPM },
            { label: "INPC", value: EPosFixedIndex.INPC },
            { label: "SELIC", value: EPosFixedIndex.SELIC },
          ]}
        />
      </div>
      <FormDateInput
        control={form.control}
        name="retrievedAt"
        label="Data de Resgate"
      />
      <Button type="submit" className="mt-4">Salvar</Button>
    </FormBody>
  )
}
