"use client"

import { useDashboard } from "@/hooks/query/use-dashboard"
import { TickersHoldingsTable } from "./_components/tickers-holdings-table"
import Container from "@/components/ui/container"
import LoadingIndicator from "@/components/ui/loading-indicator"
import DashboardNumericIndicator from "@/components/dashboard/dashboard-numeric-indicator"
import AssetsPieChart from "./_components/assets-pie-chart"
import DistributionPieChart from "./_components/distribution-pie-chart"
import { BalanceHistoryChart } from "./_components/balance-history-chart"

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useDashboard()

  console.log("Dashboard data:", dashboard)

  if (isLoading) {
    return <div className="flex justify-center items-center h-full p-8"><LoadingIndicator size="2xl" /></div>
  }

  if (!dashboard) {
    return null
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
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <DashboardNumericIndicator
            label="Saldo Total"
            amount={dashboard.totalBalance}
            prefix="R$"
            decimals={2}
          />
          <DashboardNumericIndicator
            label="Renda Variável"
            amount={dashboard.variableIncomeTotalBalance}
            prefix="R$"
            decimals={2}
          />
          <DashboardNumericIndicator
            label="Renda Fixa"
            amount={dashboard.fixedIncomeTotalBalance}
            prefix="R$"
            decimals={2}
          />
          <DashboardNumericIndicator
            label="Previdência"
            amount={dashboard.pensionTotalBalance}
            prefix="R$"
            decimals={2}
          />
          <DashboardNumericIndicator
            label="Caixa"
            amount={dashboard.cashTotalBalance}
            prefix="R$"
            decimals={2}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <AssetsPieChart data={distributionData} />
          <DistributionPieChart data={strategyData} />
        </div>

        <BalanceHistoryChart history={dashboard.history} currentBalance={dashboard.totalBalance} />

        <TickersHoldingsTable holdings={dashboard.tickersHoldings} />
      </div>
    </Container>
  )
}
