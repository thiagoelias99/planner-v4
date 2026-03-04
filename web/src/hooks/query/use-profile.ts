import apiClient from "@/lib/api-client"
import { queriesKeys } from "@/lib/query-client"
import { IUser } from "@/models/user"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useProfile = () => {
  const query = useQuery({
    queryKey: [queriesKeys.profile],
    queryFn: async () => {

      const profile = await apiClient.get<IUser>("/users/me")

      return profile.data
    },
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData
  })
  return query
}