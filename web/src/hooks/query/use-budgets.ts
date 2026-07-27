"use client"

import apiClient from "@/lib/api-client"
import { queriesKeys } from "@/lib/query-client"
import { IPaginatedBudget, ETransactionFrequency, EPaymentMethod } from "@/models/budget"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface IBudgetQueryParams {
  page: number
  limit: number
  startDate?: string
  endDate?: string
  orderBy?: string
  order?: string
}

interface ICreateTransactionFormInput {
  id?: string
  transactionId: string
  categoryId: string
  categoryDescription: string
  description: string
  value: number
  date: string
  startDate: string
  until?: string
  freq: ETransactionFrequency
  paymentMethod: EPaymentMethod
  active: boolean
  byDay?: number
  byMonth?: number
  byMonthDay?: number
}

export const useBudgets = (params?: IBudgetQueryParams) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [queriesKeys.budget, params],
    queryFn: async () => {
      const budgets = await apiClient.get<IPaginatedBudget>("/budgets/paginated", { params })
      return budgets.data
    },
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData
  })

  const createTransaction = useMutation({
    mutationFn: async (data: ICreateTransactionFormInput) => {
      const response = await apiClient.post("/budgets/transactions/form-input", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.budget] })
    },
    onError: (error) => {
      console.error("Error in createTransaction mutation:", error)
    }
  })

  const updateTransactionItem = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<ICreateTransactionFormInput> }) => {
      const response = await apiClient.patch(`/budgets/transaction-items/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.budget] })
    },
    onError: (error) => {
      console.error("Error in updateTransactionItem mutation:", error)
    }
  })

  const deleteTransactionItem = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/budgets/transaction-items/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.budget] })
    },
    onError: (error) => {
      console.error("Error in deleteTransactionItem mutation:", error)
    }
  })

  return {
    ...query,
    createTransaction,
    updateTransactionItem,
    deleteTransactionItem
  }
}
