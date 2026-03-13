"use client"

import apiClient from "@/lib/api-client"
import { queriesKeys } from "@/lib/query-client"
import { IPaginatedData } from "@/models/paginated-data"
import { ITickerOrder } from "@/models/ticker-order"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface ICreateTickerOrderInput {
  ticker: string
  type: string
  quantity: number
  price: number
}

interface ITickerOrderQueryParams {
  page: number
  limit: number
  orderBy?: string
  order?: string
  ticker?: string
  type?: string
}

export const useTickerOrders = (params?: ITickerOrderQueryParams) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [queriesKeys.tickerOrders, params],
    queryFn: async () => {
      const tickerOrders = await apiClient.get<IPaginatedData<ITickerOrder>>("/ticker-orders", { params })

      return tickerOrders.data
    },
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData
  })

  const createTickerOrder = useMutation({
    mutationFn: async (data: ICreateTickerOrderInput) => {
      const response = await apiClient.post<ITickerOrder>("/ticker-orders", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.tickerOrders] })
    },
    onError: (error) => {
      console.error("Error in createTickerOrder mutation:", error)
    }
  })

  return { ...query, createTickerOrder }
}
