"use client"

import { useDashboard } from "@/hooks/query/use-dashboard"
import NumberCountUp from "@/components/ui/number-count-up"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell } from "recharts"
import { TickersHoldingsTable } from "./_components/tickers-holdings-table"

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useDashboard()

  if (isLoading) {
    return <div className="flex justify-center items-center h-full p-8"><p>Carregando dashboard...</p></div>
  }

  if (!dashboard) {
    return null
  }

  // Data for actual balance distribution
  const distributionData = [
    { name: "Caixa", value: Number(dashboard.cashTotalBalance), fill: "var(--color-cash)" },
    { name: "Renda Fixa", value: Number(dashboard.fixedIncomeTotalBalance), fill: "var(--color-fixed)" },
    { name: "Renda Variável", value: Number(dashboard.genericVariableIncomeTotalBalance), fill: "var(--color-variable)" },
    { name: "Previdência", value: Number(dashboard.pensionTotalBalance), fill: "var(--color-pension)" },
    { name: "Imóveis", value: Number(dashboard.propertyTotalBalance), fill: "var(--color-property)" },
    { name: "Ações M.", value: Number(dashboard.shareTotalBalance), fill: "var(--color-share)" },
    { name: "FIIs", value: Number(dashboard.reitTotalBalance), fill: "var(--color-reit)" },
    { name: "Internacional", value: Number(dashboard.internationalTotalBalance), fill: "var(--color-intl)" },
    { name: "Ouro", value: Number(dashboard.goldTotalBalance), fill: "var(--color-gold)" },
    { name: "Cripto", value: Number(dashboard.cryptoTotalBalance), fill: "var(--color-crypto)" },
    { name: "Outros", value: Number(dashboard.otherTotalBalance), fill: "var(--color-other)" },
  ].filter(item => item.value > 0)

  const distributionConfig = {
    cash: { label: "Caixa", color: "hsl(var(--chart-1))" },
    fixed: { label: "Renda Fixa", color: "hsl(var(--chart-2))" },
    variable: { label: "Renda Variável", color: "hsl(var(--chart-3))" },
    pension: { label: "Previdência", color: "hsl(var(--chart-4))" },
    property: { label: "Imóveis", color: "hsl(var(--chart-5))" },
    share: { label: "Ações", color: "hsl(var(--chart-1))" },
    reit: { label: "FIIs", color: "hsl(var(--chart-2))" },
    intl: { label: "Internacional", color: "hsl(var(--chart-3))" },
    gold: { label: "Ouro", color: "hsl(var(--chart-4))" },
    crypto: { label: "Cripto", color: "hsl(var(--chart-5))" },
    other: { label: "Outros", color: "hsl(var(--chart-1))" },
  }

  // Data for strategy
  const strategy = dashboard.assetBalanceStrategy
  const strategyData = strategy ? [
    { name: "Caixa", value: Number(strategy.cashBox), fill: "var(--color-cash)" },
    { name: "Renda Fixa", value: Number(strategy.fixedIncome), fill: "var(--color-fixed)" },
    { name: "Renda Variável", value: Number(strategy.variableIncome), fill: "var(--color-variable)" },
    { name: "Previdência", value: Number(strategy.pension), fill: "var(--color-pension)" },
    { name: "Imóveis", value: Number(strategy.property), fill: "var(--color-property)" },
    { name: "Ações M.", value: Number(strategy.share), fill: "var(--color-share)" },
    { name: "FIIs", value: Number(strategy.reit), fill: "var(--color-reit)" },
    { name: "Internacional", value: Number(strategy.international), fill: "var(--color-intl)" },
    { name: "Ouro", value: Number(strategy.gold), fill: "var(--color-gold)" },
    { name: "Cripto", value: Number(strategy.crypto), fill: "var(--color-crypto)" },
    { name: "Outros", value: Number(strategy.other), fill: "var(--color-other)" },
  ].filter(item => item.value > 0) : []

  const strategyConfig = {
    cash: { label: "Caixa", color: "hsl(var(--chart-1))" },
    fixed: { label: "Renda Fixa", color: "hsl(var(--chart-2))" },
    variable: { label: "Renda Variável", color: "hsl(var(--chart-3))" },
    pension: { label: "Previdência", color: "hsl(var(--chart-4))" },
    property: { label: "Imóveis", color: "hsl(var(--chart-5))" },
    share: { label: "Ações", color: "hsl(var(--chart-1))" },
    reit: { label: "FIIs", color: "hsl(var(--chart-2))" },
    intl: { label: "Internacional", color: "hsl(var(--chart-3))" },
    gold: { label: "Ouro", color: "hsl(var(--chart-4))" },
    crypto: { label: "Cripto", color: "hsl(var(--chart-5))" },
    other: { label: "Outros", color: "hsl(var(--chart-1))" },
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <NumberCountUp prefix="R$" decimals={2} amount={dashboard.totalBalance} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renda Variável (Atual)</CardTitle>
          </CardHeader>
          <CardContent>
            <NumberCountUp prefix="R$" decimals={2} amount={dashboard.variableIncomeTotalBalance} />
            <p className="text-xs text-muted-foreground mt-1">
              Investido: R$ {dashboard.variableIncomeTotalInvested.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <NumberCountUp prefix="R$" decimals={2} amount={dashboard.cashTotalBalance} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Previdência</CardTitle>
          </CardHeader>
          <CardContent>
            <NumberCountUp prefix="R$" decimals={2} amount={dashboard.pensionTotalBalance} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Distribuição Atual</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {distributionData.length > 0 ? (
              <ChartContainer config={distributionConfig} className="mx-auto aspect-square max-h-[300px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={distributionData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} paddingAngle={2}>
                    {distributionData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />
                </PieChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center pt-8">Sem dados de saldo.</p>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Alocação Ideal (Estratégia)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {strategyData.length > 0 ? (
              <ChartContainer config={strategyConfig} className="mx-auto aspect-square max-h-[300px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={strategyData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} paddingAngle={2}>
                    {strategyData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />
                </PieChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center pt-8">Estratégia não configurada.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <TickersHoldingsTable holdings={dashboard.tickersHoldings} />

    </div>
  )
}
