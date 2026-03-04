"use client"

import { saveTestFormAction } from "@/actions/test-form/save-test-form.action"
import { EEnumOptions, EEnumOptionsMapper, saveTestFormSchema } from "@/actions/test-form/test-form.schema"
import { FormColorInput, FormCurrencyInput, FormDateInput, FormInput, FormNumberInput, FormPercentageInput, FormSelect, FormTextarea } from "@/components/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { addDays } from "date-fns"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

export default function FormTestPage() {
  const formSchema = saveTestFormSchema
  type FormSchemaType = z.infer<typeof formSchema>

  const optionList = Object.values(EEnumOptions).map((value) => ({
    label: EEnumOptionsMapper[value],
    value: value,
  }))

  const option2List = [
    { label: "Inglês", value: "en" },
    { label: "Espanhol", value: "es" },
    { label: "Francês", value: "fr" },
    { label: "Alemão", value: "de" },
    { label: "Italiano", value: "it" },
    { label: "Chinês", value: "zh" },
    { label: "Japonês", value: "ja" },
  ]

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "teste",
      description: "descrição de teste",
      quantity: 1,
      floatQuantity: 0.1,
      amount: 99.99,
      percentage: 50,
      option: EEnumOptions.OPTION_A,
      option2: option2List[0].value,
      eventDate: addDays(new Date(), 12),
      color: "#3b82f6",
    },
  })

  async function onSubmit(data: FormSchemaType) {
    await saveTestFormAction(data)
    // form.reset()
    toast("Formulário salvo com sucesso!")
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Formulário de Teste</CardTitle>
        <CardDescription>
          Formulário de teste para ação protegida com validação de esquema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormInput
            control={form.control}
            name="name"
            label="Nome"
            placeholder="Digite seu nome"
            required
          />

          <FormTextarea
            control={form.control}
            name="description"
            label="Descrição"
            placeholder="Fale um pouco sobre você"
            description="Fale um pouco sobre você. Isso será usado para nos ajudar a personalizar sua experiência."
          />

          <FormNumberInput
            control={form.control}
            name="quantity"
            label="Quantidade"
            step={1}
            min={1}
            max={100}
          />

          <FormNumberInput
            control={form.control}
            name="floatQuantity"
            label="Quantidade"
            step={0.1}
            min={0.1}
            max={1000}
          />

          <FormCurrencyInput
            control={form.control}
            name="amount"
            label="Valor"
          />

          <FormPercentageInput
            control={form.control}
            name="percentage"
            label="Porcentagem"
          />

          <FormSelect
            control={form.control}
            name="option"
            label="Opção"
            options={optionList}
            description="Selecione uma das opções disponíveis."
            required
          />

          <FormSelect
            control={form.control}
            name="option2"
            label="Opção 2"
            options={option2List}
            description="Selecione uma das opções disponíveis."
          />

          <FormDateInput
            control={form.control}
            name="eventDate"
            label="Data do Evento"
            mode="datetime"
            description="Selecione a data e hora do evento."
            required
          />

          <FormColorInput
            control={form.control}
            name="color"
            label="Cor Favorita"
            description="Escolha uma cor no formato hexadecimal."
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            Salvar
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
