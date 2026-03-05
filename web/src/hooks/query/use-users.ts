"use client"

import apiClient from "@/lib/api-client"
import { queriesKeys } from "@/lib/query-client"
import { IPaginatedData } from "@/models/paginated-data"
import { IUser } from "@/models/user"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

interface IUserQueryParams {
  page: number
  limit: number
  orderBy?: string
  order?: string
  search?: string
  role?: string
}

export const useUsers = (params: IUserQueryParams) => {
  const query = useQuery({
    queryKey: [queriesKeys.users, params],
    queryFn: async () => {
      const users = await apiClient.get<IPaginatedData<IUser>>("/users", { params })

      return users.data
    },
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData
  })
  return query
}