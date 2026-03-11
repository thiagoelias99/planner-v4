"use client"

import apiClient from "@/lib/api-client"
import { queriesKeys } from "@/lib/query-client"
import { IPaginatedData } from "@/models/paginated-data"
import { IFixedIncome, EPosFixedIndex } from "@/models/fixed-income"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface ICreateFixedIncomeInput {
  description: string
  agency?: string
  note?: string
  initialInvestment: number
  currentValue: number
  date: string
  dueDate: string
  fixedRate: number
  posFixedIndex: EPosFixedIndex
  retrievedAt?: string
}

interface IFixedIncomeQueryParams {
  page: number
  limit: number
  orderBy?: string
  order?: string
  description?: string
  agency?: string
  posFixedIndex?: EPosFixedIndex
  dateFrom?: string
  dateTo?: string
  dueDateFrom?: string
  dueDateTo?: string
}

export const useFixedIncomes = (params?: IFixedIncomeQueryParams) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [queriesKeys.fixedIncome, params],
    queryFn: async () => {
      const fixedIncomes = await apiClient.get<IPaginatedData<IFixedIncome>>("/fixed-incomes", { params })

      return fixedIncomes.data
    },
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData
  })

  const createFixedIncome = useMutation({
    mutationFn: async (data: ICreateFixedIncomeInput) => {
      const response = await apiClient.post<IFixedIncome>("/fixed-incomes", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.fixedIncome] })
    },
    onError: (error) => {
      console.error("Error in createFixedIncome mutation:", error)
    }
  })

  return { ...query, createFixedIncome }
}
