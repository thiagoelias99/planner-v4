"use client"

import { CreateUserFormData } from "@/app/app/(protected)/admin/usuarios/_components/create-users-form"
import apiClient from "@/lib/api-client"
import { queriesKeys } from "@/lib/query-client"
import { IPaginatedData } from "@/models/paginated-data"
import { IUser } from "@/models/user"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface IUserQueryParams {
  page: number
  limit: number
  orderBy?: string
  order?: string
  search?: string
  role?: string
}

export const useUsers = (params?: IUserQueryParams) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [queriesKeys.users, params],
    queryFn: async () => {
      const users = await apiClient.get<IPaginatedData<IUser>>("/users", { params })

      return users.data
    },
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData
  })

  const createUser = useMutation({
    mutationFn: async (data: CreateUserFormData) => {
      const response = await apiClient.post<IUser>("/users", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.users] })
    },
    onError: (error) => {
      console.error("Error in createUser mutation:", error)
    }
  })

  return { ...query, createUser }
}