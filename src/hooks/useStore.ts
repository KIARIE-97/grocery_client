import { createStore, getStore, getStoreById, updateStore } from "@/api/store"
import type { TStore, TStoreForm } from "@/types/store.types"
import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query"

export const useStores = (): UseQueryResult => {
  return useQuery({
    queryKey: ['stores'],
    queryFn: getStore,
  })
}
export const useStore = (id: string): UseQueryResult => {
  return useQuery({
    queryKey: ['stores', id],
    queryFn: () => getStoreById(id),
    enabled: !!id,
  })
}
export const useCreateStore = (): UseMutationResult<
  TStoreForm,
  Error,
  TStoreForm
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['createStore'],
    mutationFn: (storeData) => createStore(storeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Categories'], exact: true })
    },
  })
}
// Update store by ID
export const useUpdateStore = (): UseMutationResult<TStore, Error, { id: string; storeData: TStore }> => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: ['updateCategory'],
      mutationFn: ({ id, storeData }) => updateStore(id, storeData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'], exact: true })
      },
    })
}
//delete store by ID
export const useDeleteStore = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['deleteStore'],
    mutationFn: (id) => updateStore(id, { id, store_name: '' }), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'], exact: true })
    },
  })
}   

