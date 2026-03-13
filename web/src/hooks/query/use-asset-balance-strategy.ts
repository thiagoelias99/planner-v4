import { useMutation, useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'
import { IAssetBalanceStrategy, IUpdateAssetBalanceStrategy } from '@/models/asset-balance-strategy'
import { queriesKeys, queryClient } from '@/lib/query-client'

export function useAssetBalanceStrategy() {
  const query = useQuery({
    queryKey: [queriesKeys.assetBalanceStrategy],
    queryFn: async () => {
      const { data } = await apiClient.get<IAssetBalanceStrategy>('/asset-balance-strategy')
      return data
    },
  })

  const updateAssetBalanceStrategy = useMutation({
    mutationFn: async (payload: IUpdateAssetBalanceStrategy) => {
      const { data } = await apiClient.put<IAssetBalanceStrategy>('/asset-balance-strategy', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.assetBalanceStrategy] })
    }
  })

  return { ...query, updateAssetBalanceStrategy }
}
