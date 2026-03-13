import { useMutation, useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'
import { IQueryOtherAsset, ICreateOtherAsset, IOtherAsset } from '@/models/other-asset'
import { IPaginatedData } from '@/models/paginated-data'
import { queriesKeys, queryClient } from '@/lib/query-client'

export function useOtherAssets(params?: IQueryOtherAsset) {
  const query = useQuery({
    queryKey: [queriesKeys.otherAssets, params],
    queryFn: async () => {
      const { data } = await apiClient.get<IPaginatedData<IOtherAsset>>('/other-assets', { params })
      return data
    },
  })

  // create mutation added here but wait, the return type needs to be an object with .createOtherAsset
  // I will just export useCreateOtherAsset globally and have the query return the normal query properties

  const createOtherAsset = useMutation({
    mutationFn: async (payload: ICreateOtherAsset) => {
      const { data } = await apiClient.post<IOtherAsset>('/other-assets', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.otherAssets] })
    }
  })

  return { ...query, createOtherAsset }
}
