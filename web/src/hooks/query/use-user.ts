"use client"

import { UpdateUserFormData } from "@/app/app/(protected)/admin/usuarios/_components/update-users-form"
import apiClient from "@/lib/api-client"
import { queriesKeys } from "@/lib/query-client"
import { IUser } from "@/models/user"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useUser = (id: string) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [queriesKeys.users, id],
    queryFn: async () => {
      const user = await apiClient.get<IUser>(`/users/${id}`)

      return user.data
    },
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData
  })

  const updateUser = useMutation({
    mutationFn: async (data: UpdateUserFormData) => {
      const response = await apiClient.put<IUser>(`/users/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.users] })
    },
    onError: (error) => {
      console.error("Error in updateUser mutation:", error)
    }
  })

  const requestPasswordReset = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await apiClient.post(`/users/${id}/reset-password`, null, {
        params: {
          redirectTo: new URL(`${process.env.NEXT_PUBLIC_URL}/app/redefinir-senha`).toString()
        }
      })
      return response.data
    }
  })

  return { ...query, updateUser, requestPasswordReset }
}