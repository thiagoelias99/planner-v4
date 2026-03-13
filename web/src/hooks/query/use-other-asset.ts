import { useMutation, useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'
import { IOtherAsset, IUpdateOtherAsset } from '@/models/other-asset'
import { queriesKeys, queryClient } from '@/lib/query-client'

export function useOtherAsset(id?: string) {
  const query = useQuery({
    queryKey: [queriesKeys.otherAssets, id],
    queryFn: async () => {
      if (!id) return null
      const { data } = await apiClient.get<IOtherAsset>(`/other-assets/${id}`)
      return data
    },
    enabled: !!id
  })

  const updateOtherAsset = useMutation({
    mutationFn: async (payload: IUpdateOtherAsset) => {
      const { data } = await apiClient.put<IOtherAsset>(`/other-assets/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.otherAssets] })
    }
  })

  const deleteOtherAsset = useMutation({
    mutationFn: async (toDeleteId: string) => {
      await apiClient.delete(`/other-assets/${toDeleteId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.otherAssets] })
    }
  })

  return { ...query, updateOtherAsset, deleteOtherAsset }
}
