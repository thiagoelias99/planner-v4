import apiClient from "@/lib/api-client"
import { queriesKeys } from "@/lib/query-client"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { IAssetBalanceStrategy } from "@/models/asset-balance-strategy"
import { ETickerType } from "@/models/ticker"

export interface ITickerHolding {
  symbol: string
  name: string
  type: ETickerType
  quantity: number
  avgPrice: number
  currentPrice: number
  totalValue: number
  invested: number
  profitLoss: number
  profitLossPercent: number
}

export interface IPortfolioHistoryItem {
  id: string
  portfolioHistoryId: string
  fixedIncomeId: string | null
  otherAssetId: string | null
  type: string
  description: string
  agency: string | null
  note: string | null
  value: number
  dueDate: Date | null
  fixedRate: number | null
  posFixedIndex: string | null
  createdAt: Date
}

export interface IPortfolioHistory {
  id: string
  userId: string
  snapshotDate: Date
  variableIncomeTotalInvested: number
  variableIncomeTotalBalance: number
  shareTotalBalance: number
  reitTotalBalance: number
  internationalTotalBalance: number
  goldTotalBalance: number
  cryptoTotalBalance: number
  genericVariableIncomeTotalBalance: number
  cashTotalBalance: number
  pensionTotalBalance: number
  fixedIncomeTotalBalance: number
  propertyTotalBalance: number
  otherTotalBalance: number
  totalBalance: number
  assetBalanceStrategySnapshot: string | null
  createdAt: Date
  items: IPortfolioHistoryItem[]
}

export interface IDashboardSummary {
  variableIncomeTotalInvested: number
  variableIncomeTotalBalance: number
  shareTotalBalance: number
  reitTotalBalance: number
  internationalTotalBalance: number
  goldTotalBalance: number
  cryptoTotalBalance: number
  genericVariableIncomeTotalBalance: number
  cashTotalBalance: number
  pensionTotalBalance: number
  fixedIncomeTotalBalance: number
  propertyTotalBalance: number
  otherTotalBalance: number
  totalBalance: number
  assetBalanceStrategy: IAssetBalanceStrategy | null
  assetCurrentBalance: IAssetBalanceStrategy | null
  tickersHoldings: ITickerHolding[]
  history: IPortfolioHistory[]
}

export const useDashboard = () => {
  const query = useQuery({
    queryKey: [queriesKeys.dashboard],
    queryFn: async () => {
      const response = await apiClient.get<IDashboardSummary>("/dashboard/summary")
      return response.data
    },
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData
  })
  return query
}
