"use client"

import { queriesKeys } from "@/lib/query-client"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

interface IUserQueryParams {
  page: number,
  limit: number,
}

export const useUsers = (params: IUserQueryParams) => {
  const query = useQuery({
    queryKey: [queriesKeys.users, params],
    queryFn: async () => {


    },
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData
  })
  return query
}