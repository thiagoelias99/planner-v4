"use client"

import apiClient from "@/lib/api-client"
import { queriesKeys } from "@/lib/query-client"
import { IPaginatedData } from "@/models/paginated-data"
import { ITicker } from "@/models/ticker"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface ICreateTickerInput {
  symbol: string
  name: string
  type: string
  price?: number
}

interface ITickerQueryParams {
  page: number
  limit: number
  orderBy?: string
  order?: string
  search?: string
  type?: string
  autoUpdate?: boolean
}

export const useTickers = (params?: ITickerQueryParams) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [queriesKeys.tickers, params],
    queryFn: async () => {
      const tickers = await apiClient.get<IPaginatedData<ITicker>>("/tickers", { params })

      return tickers.data
    },
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData
  })

  const createTicker = useMutation({
    mutationFn: async (data: ICreateTickerInput) => {
      const response = await apiClient.post<ITicker>("/tickers", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.tickers] })
    },
    onError: (error) => {
      console.error("Error in createTicker mutation:", error)
    }
  })

  const autoUpdateTickers = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/tickers/auto-update")
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.tickers] })
    },
    onError: (error) => {
      console.error("Error in autoUpdateTickers mutation:", error)
    }
  })

  return { ...query, createTicker, autoUpdateTickers }
}
