"use client"

import apiClient from "@/lib/api-client"
import { queriesKeys } from "@/lib/query-client"
import { ITickerOrder } from "@/models/ticker-order"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface IUpdateTickerOrderInput {
  ticker?: string
  type?: string
  quantity?: number
  price?: number
}

export const useTickerOrder = (id: string) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [queriesKeys.tickerOrders, id],
    queryFn: async () => {
      const tickerOrder = await apiClient.get<ITickerOrder>(`/ticker-orders/${id}`)

      return tickerOrder.data
    },
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData
  })

  const updateTickerOrder = useMutation({
    mutationFn: async (data: IUpdateTickerOrderInput) => {
      const response = await apiClient.put<ITickerOrder>(`/ticker-orders/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.tickerOrders] })
    },
    onError: (error) => {
      console.error("Error in updateTickerOrder mutation:", error)
    }
  })

  const deleteTickerOrder = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/ticker-orders/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.tickerOrders] })
    },
    onError: (error) => {
      console.error("Error in deleteTickerOrder mutation:", error)
    }
  })

  return { ...query, updateTickerOrder, deleteTickerOrder }
}
