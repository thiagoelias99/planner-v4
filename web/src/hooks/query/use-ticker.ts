"use client"

import apiClient from "@/lib/api-client"
import { queriesKeys } from "@/lib/query-client"
import { ITicker } from "@/models/ticker"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface IUpdateTickerInput {
  name?: string
  type?: string
  price?: number
  autoUpdate?: boolean
}

export const useTicker = (id: string) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [queriesKeys.tickers, id],
    queryFn: async () => {
      const ticker = await apiClient.get<ITicker>(`/tickers/${id}`)

      return ticker.data
    },
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData
  })

  const updateTicker = useMutation({
    mutationFn: async (data: IUpdateTickerInput) => {
      const response = await apiClient.put<ITicker>(`/tickers/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.tickers] })
    },
    onError: (error) => {
      console.error("Error in updateTicker mutation:", error)
    }
  })

  return { ...query, updateTicker }
}
