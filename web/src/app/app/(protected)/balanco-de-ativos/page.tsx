"use client"

import { Button } from "@/components/ui/button"
import { FormBody, FormPercentageInput, FormTextarea } from "@/components/form"
import Container from "@/components/ui/container"
import { useAssetBalanceStrategy } from "@/hooks/query/use-asset-balance-strategy"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2Icon } from "lucide-react"
import { AxiosError } from "axios"
import { useDashboard } from "@/hooks/query/use-dashboard"
import { formatPercentage } from "@/lib/utils"

// Local component to display current allocation and correction amount
interface AssetBalanceInfoProps {
  fieldName: string
  currentPercent: number
  correction: number
}

function AssetBalanceInfo({ currentPercent, correction }: AssetBalanceInfoProps) {
  const currentPercentage = formatPercentage(currentPercent, { divideBy: 100 })
  const sign = correction >= 0 ? "+" : ""
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Math.abs(correction))

  const correctionColor = correction >= 0
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400"

  return (
    <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
      <div>Atual: {currentPercentage}</div>
      <div className={`font-medium ${correctionColor}`}>
        Correção: {sign} {formatted}
      </div>
    </div>
  )
}

const formSchema = z.object({
  cashBox: z.string().superRefine((val, ctx) => {
    const num = parseFloat(val.replace(",", "."))
    if (isNaN(num) || num < 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Deve ser maior ou igual a 0." })
  }),
  fixedIncome: z.string().superRefine((val, ctx) => {
    const num = parseFloat(val.replace(",", "."))
    if (isNaN(num) || num < 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Deve ser maior ou igual a 0." })
  }),
  // variableIncome: z.string().superRefine((val, ctx) => {
  //   const num = parseFloat(val.replace(",", "."))
  //   if (isNaN(num) || num < 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Deve ser maior ou igual a 0." })
  // }),
  pension: z.string().superRefine((val, ctx) => {
    const num = parseFloat(val.replace(",", "."))
    if (isNaN(num) || num < 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Deve ser maior ou igual a 0." })
  }),
  property: z.string().superRefine((val, ctx) => {
    const num = parseFloat(val.replace(",", "."))
    if (isNaN(num) || num < 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Deve ser maior ou igual a 0." })
  }),
  share: z.string().superRefine((val, ctx) => {
    const num = parseFloat(val.replace(",", "."))
    if (isNaN(num) || num < 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Deve ser maior ou igual a 0." })
  }),
  reit: z.string().superRefine((val, ctx) => {
    const num = parseFloat(val.replace(",", "."))
    if (isNaN(num) || num < 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Deve ser maior ou igual a 0." })
  }),
  international: z.string().superRefine((val, ctx) => {
    const num = parseFloat(val.replace(",", "."))
    if (isNaN(num) || num < 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Deve ser maior ou igual a 0." })
  }),
  gold: z.string().superRefine((val, ctx) => {
    const num = parseFloat(val.replace(",", "."))
    if (isNaN(num) || num < 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Deve ser maior ou igual a 0." })
  }),
  crypto: z.string().superRefine((val, ctx) => {
    const num = parseFloat(val.replace(",", "."))
    if (isNaN(num) || num < 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Deve ser maior ou igual a 0." })
  }),
  other: z.string().superRefine((val, ctx) => {
    const num = parseFloat(val.replace(",", "."))
    if (isNaN(num) || num < 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Deve ser maior ou igual a 0." })
  }),
  notes: z.string().max(500, "A nota deve conter no máximo 500 caracteres.").optional(),
})

export default function AssetBalanceStrategyPage() {
  const { data: strategy, isLoading, updateAssetBalanceStrategy } = useAssetBalanceStrategy()
  const { data: dashboardData } = useDashboard()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cashBox: "10",
      fixedIncome: "10",
      // variableIncome: "10",
      pension: "10",
      property: "10",
      share: "10",
      reit: "10",
      international: "10",
      gold: "10",
      crypto: "10",
      other: "0",
      notes: "",
    },
  })

  // Set default values when data loads
  useEffect(() => {
    if (strategy) {
      form.reset({
        cashBox: strategy.cashBox.toString(),
        fixedIncome: strategy.fixedIncome.toString(),
        // variableIncome: strategy.variableIncome.toString(),
        pension: strategy.pension.toString(),
        property: strategy.property.toString(),
        share: strategy.share.toString(),
        reit: strategy.reit.toString(),
        international: strategy.international.toString(),
        gold: strategy.gold.toString(),
        crypto: strategy.crypto.toString(),
        other: strategy.other.toString(),
        notes: strategy.notes || "",
      })
    }
  }, [strategy, form])

  // Watch all values to calculate sum
  const formValues = useWatch({ control: form.control })

  const calculateSum = () => {
    const fields = [
      formValues.cashBox, formValues.fixedIncome, // formValues.variableIncome,
      formValues.pension, formValues.property, formValues.share,
      formValues.reit, formValues.international, formValues.gold,
      formValues.crypto, formValues.other
    ]

    let sum = 0
    fields.forEach(val => {
      if (typeof val === 'string') {
        const num = parseFloat(val.replace(",", "."))
        if (!isNaN(num)) sum += num
      }
    })
    return sum
  }

  const currentSum = Math.round(calculateSum() * 100) / 100
  const isSumValid = currentSum === 100.0

  // Calculate correction needed in R$ for each asset type
  const calculateCorrection = (fieldName: keyof typeof formValues): number => {
    if (!dashboardData?.assetCurrentBalance || !dashboardData?.totalBalance) return 0

    const plannedPercent = parseFloat(String(formValues[fieldName] || "0").replace(",", "."))
    const currentPercent = Number(dashboardData.assetCurrentBalance[fieldName] || 0)
    const totalBalance = Number(dashboardData.totalBalance || 0)

    // Correction = (planned% - current%) / 100 * totalBalance
    return ((plannedPercent - currentPercent) / 100) * totalBalance
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!isSumValid) return

    try {
      const submitData = {
        cashBox: parseFloat(data.cashBox.replace(",", ".")),
        fixedIncome: parseFloat(data.fixedIncome.replace(",", ".")),
        // variableIncome: parseFloat(data.variableIncome.replace(",", ".")),
        pension: parseFloat(data.pension.replace(",", ".")),
        property: parseFloat(data.property.replace(",", ".")),
        share: parseFloat(data.share.replace(",", ".")),
        reit: parseFloat(data.reit.replace(",", ".")),
        international: parseFloat(data.international.replace(",", ".")),
        gold: parseFloat(data.gold.replace(",", ".")),
        crypto: parseFloat(data.crypto.replace(",", ".")),
        other: parseFloat(data.other.replace(",", ".")),
        notes: data.notes || undefined,
      }

      await updateAssetBalanceStrategy.mutateAsync(submitData)
      toast.success("Estratégia atualizada com sucesso!")
    } catch (error) {
      if (error instanceof AxiosError) {
        const messages = error?.response?.data?.message
        const errorMessages = Array.isArray(messages) ? messages : [messages].filter(Boolean)
        const errorMessage = errorMessages.length > 0 ? errorMessages.join("\n") : error?.message || "Erro ao atualizar estratégia"
        toast.error(errorMessage)
        return
      }
      const err = error as Error
      toast.error(err?.message || "Erro ao atualizar estratégia")
    }
  }

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center p-12">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </Container>
    )
  }

  return (
    <Container className="max-w-4xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Balanço de Ativos (Estratégia)</CardTitle>
          <CardDescription>
            Defina o percentual alvo de alocação para cada classe de ativos. A soma de todas as classes deve ser exatamente 100%.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Alocação Total</span>
              <span className={`text-sm font-bold ${isSumValid ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                {currentSum}% / 100%
              </span>
            </div>
            <Progress
              value={currentSum > 100 ? 100 : currentSum}
              className={isSumValid ? "[&>div]:bg-green-600 dark:[&>div]:bg-green-400" : "[&>div]:bg-destructive"}
            />
            {!isSumValid && (
              <p className="text-xs text-destructive mt-2">
                A soma das alocações deve ser exatamente 100%. Atualmente está em {currentSum}%.
              </p>
            )}
          </div>

          <FormBody onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              <div>
                <FormPercentageInput control={form.control} name="cashBox" label="Caixinha" />
                <AssetBalanceInfo
                  fieldName="cashBox"
                  currentPercent={Number(dashboardData?.assetCurrentBalance?.cashBox || 0)}
                  correction={calculateCorrection("cashBox")}
                />
              </div>
              <div>
                <FormPercentageInput control={form.control} name="fixedIncome" label="Renda Fixa" />
                <AssetBalanceInfo
                  fieldName="fixedIncome"
                  currentPercent={Number(dashboardData?.assetCurrentBalance?.fixedIncome || 0)}
                  correction={calculateCorrection("fixedIncome")}
                />
              </div>
              {/* <FormPercentageInput control={form.control} name="variableIncome" label="Renda Variável" /> */}
              <div>
                <FormPercentageInput control={form.control} name="pension" label="Previdência" />
                <AssetBalanceInfo
                  fieldName="pension"
                  currentPercent={Number(dashboardData?.assetCurrentBalance?.pension || 0)}
                  correction={calculateCorrection("pension")}
                />
              </div>
              <div>
                <FormPercentageInput control={form.control} name="property" label="Imóveis" />
                <AssetBalanceInfo
                  fieldName="property"
                  currentPercent={Number(dashboardData?.assetCurrentBalance?.property || 0)}
                  correction={calculateCorrection("property")}
                />
              </div>
              <div>
                <FormPercentageInput control={form.control} name="share" label="Ações" />
                <AssetBalanceInfo
                  fieldName="share"
                  currentPercent={Number(dashboardData?.assetCurrentBalance?.share || 0)}
                  correction={calculateCorrection("share")}
                />
              </div>
              <div>
                <FormPercentageInput control={form.control} name="reit" label="Fundos Imobiliários" />
                <AssetBalanceInfo
                  fieldName="reit"
                  currentPercent={Number(dashboardData?.assetCurrentBalance?.reit || 0)}
                  correction={calculateCorrection("reit")}
                />
              </div>
              <div>
                <FormPercentageInput control={form.control} name="international" label="Internacional" />
                <AssetBalanceInfo
                  fieldName="international"
                  currentPercent={Number(dashboardData?.assetCurrentBalance?.international || 0)}
                  correction={calculateCorrection("international")}
                />
              </div>
              <div>
                <FormPercentageInput control={form.control} name="gold" label="Ouro" />
                <AssetBalanceInfo
                  fieldName="gold"
                  currentPercent={Number(dashboardData?.assetCurrentBalance?.gold || 0)}
                  correction={calculateCorrection("gold")}
                />
              </div>
              <div>
                <FormPercentageInput control={form.control} name="crypto" label="Criptomoedas" />
                <AssetBalanceInfo
                  fieldName="crypto"
                  currentPercent={Number(dashboardData?.assetCurrentBalance?.crypto || 0)}
                  correction={calculateCorrection("crypto")}
                />
              </div>
              <div>
                <FormPercentageInput control={form.control} name="other" label="Outros" />
                <AssetBalanceInfo
                  fieldName="other"
                  currentPercent={Number(dashboardData?.assetCurrentBalance?.other || 0)}
                  correction={calculateCorrection("other")}
                />
              </div>
            </div>

            <div className="pt-4 border-t w-full">
              <FormTextarea
                control={form.control}
                name="notes"
                label="Notas/Observações"
                placeholder="Exemplo: Focar em renda fixa nacional este ano..."
                className="min-h-30 w-full"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={!isSumValid || updateAssetBalanceStrategy.isPending}
                className="w-full md:w-auto px-8"
              >
                {updateAssetBalanceStrategy.isPending ? "Salvando..." : "Salvar Estratégia"}
              </Button>
            </div>
          </FormBody>
        </CardContent>
      </Card>
    </Container>
  )
}
