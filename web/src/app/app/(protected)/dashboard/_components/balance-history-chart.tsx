"use client"

import { IPortfolioHistory } from "@/hooks/query/use-dashboard"
import ChartLineTrending from "@/components/dashboard/chart-line-trending"

interface BalanceHistoryChartProps {
  history: IPortfolioHistory[]
  currentBalance: number
}

export function BalanceHistoryChart({ history, currentBalance }: BalanceHistoryChartProps) {
  // Sort history by date and prepare data
  const historicalData = [...history]
    .sort((a, b) => new Date(a.snapshotDate).getTime() - new Date(b.snapshotDate).getTime())
    .map(item => ({
      date: item.snapshotDate,
      value: Number(item.totalBalance),
    }))

  // Add current balance to the chart data
  const currentData = {
    date: new Date(),
    value: Number(currentBalance),
  }

  const chartData = [...historicalData, currentData]

  // Get date range for description
  const firstDate = history[0]
    ? new Date(history[0].snapshotDate).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
    : ''
  const lastDate = new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })

  return (
    <ChartLineTrending
      data={chartData}
      scaleOffset={25000}
      title="Evolução do Patrimônio"
      description={`${firstDate} - ${lastDate}`}
      footerDescription="Mostrando a evolução do saldo total ao longo do tempo"
    />
  )
}
