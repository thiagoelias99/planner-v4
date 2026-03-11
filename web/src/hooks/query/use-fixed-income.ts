"use client"

import apiClient from "@/lib/api-client"
import { queriesKeys } from "@/lib/query-client"
import { IFixedIncome, EPosFixedIndex } from "@/models/fixed-income"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface IUpdateFixedIncomeInput {
  description?: string
  agency?: string
  note?: string
  initialInvestment?: number
  currentValue?: number
  date?: string
  dueDate?: string
  fixedRate?: number
  posFixedIndex?: EPosFixedIndex
  retrievedAt?: string
}

export const useFixedIncome = (id: string) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [queriesKeys.fixedIncome, id],
    queryFn: async () => {
      const fixedIncome = await apiClient.get<IFixedIncome>(`/fixed-incomes/${id}`)

      return fixedIncome.data
    },
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData
  })

  const updateFixedIncome = useMutation({
    mutationFn: async (data: IUpdateFixedIncomeInput) => {
      const response = await apiClient.put<IFixedIncome>(`/fixed-incomes/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.fixedIncome] })
    },
    onError: (error) => {
      console.error("Error in updateFixedIncome mutation:", error)
    }
  })

  const deleteFixedIncome = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/fixed-incomes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.fixedIncome] })
    },
    onError: (error) => {
      console.error("Error in deleteFixedIncome mutation:", error)
    }
  })

  return { ...query, updateFixedIncome, deleteFixedIncome }
}
