"use client"

import { useDashboard } from "@/hooks/query/use-dashboard"
import { TickersHoldingsTable } from "./_components/tickers-holdings-table"
import Container from "@/components/ui/container"
import LoadingIndicator from "@/components/ui/loading-indicator"
import DashboardNumericIndicator from "@/components/dashboard/dashboard-numeric-indicator"
import AssetsPieChart from "./_components/assets-pie-chart"
import DistributionPieChart from "./_components/distribution-pie-chart"
import { BalanceHistoryChart } from "./_components/balance-history-chart"
import { ChevronUp, ChevronDown } from "lucide-react"
import { IPortfolioHistory } from "@/hooks/query/use-dashboard"

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useDashboard()

  console.log("Dashboard data:", dashboard)

  if (isLoading) {
    return <div className="flex justify-center items-center h-full p-8"><LoadingIndicator size="2xl" /></div>
  }

  if (!dashboard) {
    return null
  }

  // Helper function to calculate change from last history point
  const calculateChange = (
    currentValue: number,
    historyField: keyof Pick<IPortfolioHistory,
      'totalBalance' |
      'variableIncomeTotalBalance' |
      'fixedIncomeTotalBalance' |
      'pensionTotalBalance' |
      'cashTotalBalance'
    >
  ) => {
    if (!dashboard.history || dashboard.history.length === 0) {
      return null
    }

    const lastHistory = dashboard.history[0] // Assuming history is sorted with most recent first
    const previousValue = Number(lastHistory[historyField])

    if (previousValue === 0) {
      return null
    }

    const absoluteChange = currentValue - previousValue
    const percentChange = (absoluteChange / previousValue) * 100

    return {
      value: absoluteChange,
      percent: percentChange,
      isPositive: absoluteChange >= 0
    }
  }

  // Helper to format the footer with change info
  const formatChangeFooter = (change: ReturnType<typeof calculateChange>) => {
    if (!change) {
      return null
    }

    const { value, percent, isPositive } = change
    const color = isPositive ? "text-green-500" : "text-red-500"
    const Icon = isPositive ? ChevronUp : ChevronDown

    return (
      <div className={`flex items-center gap-1 text-sm ${color}`}>
        <Icon className="size-4" />
        <span className="font-semibold">
          {isPositive && '+'}
          {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="text-xs">
          ({isPositive && '+'}
          {percent.toFixed(2)}%)
        </span>
      </div>
    )
  }

  // Data for actual balance distribution
  const distributionData = [
    { key: "Caixa", value: Number(dashboard.assetCurrentBalance?.cashBox), fill: "var(--color-cash)" },
    { key: "Renda Fixa", value: Number(dashboard.assetCurrentBalance?.fixedIncome), fill: "var(--color-fixed)" },
    { key: "Previdência", value: Number(dashboard.assetCurrentBalance?.pension), fill: "var(--color-pension)" },
    { key: "Imóveis", value: Number(dashboard.assetCurrentBalance?.property), fill: "var(--color-property)" },
    { key: "Ações M.", value: Number(dashboard.assetCurrentBalance?.share), fill: "var(--color-share)" },
    { key: "FIIs", value: Number(dashboard.assetCurrentBalance?.reit), fill: "var(--color-reit)" },
    { key: "Internacional", value: Number(dashboard.assetCurrentBalance?.international), fill: "var(--color-intl)" },
    { key: "Ouro", value: Number(dashboard.assetCurrentBalance?.gold), fill: "var(--color-gold)" },
    { key: "Cripto", value: Number(dashboard.assetCurrentBalance?.crypto), fill: "var(--color-crypto)" },
    { key: "Outros", value: Number(dashboard.assetCurrentBalance?.other), fill: "var(--color-other)" },
  ].filter(item => item.value > 0)

  // Data for strategy
  const strategy = dashboard.assetBalanceStrategy
  const strategyData = strategy ? [
    { key: "Caixa", value: Number(strategy.cashBox), fill: "var(--color-cash)" },
    { key: "Renda Fixa", value: Number(strategy.fixedIncome), fill: "var(--color-fixed)" },
    // { key: "Renda Variável", value: Number(strategy.variableIncome), fill: "var(--color-variable)" },
    { key: "Previdência", value: Number(strategy.pension), fill: "var(--color-pension)" },
    { key: "Imóveis", value: Number(strategy.property), fill: "var(--color-property)" },
    { key: "Ações M.", value: Number(strategy.share), fill: "var(--color-share)" },
    { key: "FIIs", value: Number(strategy.reit), fill: "var(--color-reit)" },
    { key: "Internacional", value: Number(strategy.international), fill: "var(--color-intl)" },
    { key: "Ouro", value: Number(strategy.gold), fill: "var(--color-gold)" },
    { key: "Cripto", value: Number(strategy.crypto), fill: "var(--color-crypto)" },
    { key: "Outros", value: Number(strategy.other), fill: "var(--color-other)" },
  ].filter(item => item.value > 0) : []

  return (
    <Container>
      <div className="grid sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-12 gap-4 py-4 md:gap-6 md:py-6">
        <h1 className="text-3xl font-bold tracking-tight col-span-full">Dashboard</h1>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-12 col-span-full">
          <DashboardNumericIndicator
            label="Saldo Total"
            amount={dashboard.totalBalance}
            prefix="R$"
            decimals={2}
            emphasis
            footer={formatChangeFooter(calculateChange(dashboard.totalBalance, 'totalBalance'))}
            className="sm:col-span-2 lg:col-span-1 xl:col-span-4"
          />
          <DashboardNumericIndicator
            label="Renda Variável"
            amount={dashboard.variableIncomeTotalBalance}
            prefix="R$"
            decimals={2}
            footer={formatChangeFooter(calculateChange(dashboard.variableIncomeTotalBalance, 'variableIncomeTotalBalance'))}
            className="xl:col-span-2"
          />
          <DashboardNumericIndicator
            label="Renda Fixa"
            amount={dashboard.fixedIncomeTotalBalance}
            prefix="R$"
            decimals={2}
            footer={formatChangeFooter(calculateChange(dashboard.fixedIncomeTotalBalance, 'fixedIncomeTotalBalance'))}
            className="xl:col-span-2"
          />
          <DashboardNumericIndicator
            label="Previdência"
            amount={dashboard.pensionTotalBalance}
            prefix="R$"
            decimals={2}
            footer={formatChangeFooter(calculateChange(dashboard.pensionTotalBalance, 'pensionTotalBalance'))}
            className="xl:col-span-2"
          />
          <DashboardNumericIndicator
            label="Caixa"
            amount={dashboard.cashTotalBalance}
            prefix="R$"
            decimals={2}
            footer={formatChangeFooter(calculateChange(dashboard.cashTotalBalance, 'cashTotalBalance'))}
            className="xl:col-span-2"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 col-span-full xl:col-span-6">
          <AssetsPieChart data={distributionData} />
          <DistributionPieChart data={strategyData} />
        </div>

        <div className="w-full col-span-full xl:col-span-6">
          <BalanceHistoryChart
            history={dashboard.history}
            currentBalance={dashboard.totalBalance}
            className="h-64 xl:h-52"
          />
        </div>

        <div className="w-full col-span-full">
          <TickersHoldingsTable holdings={dashboard.tickersHoldings} />
        </div>
      </div>
    </Container>
  )
}
