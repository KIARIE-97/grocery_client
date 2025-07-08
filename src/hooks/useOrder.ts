import { createOrder, deleteOrder, getOrder, getOrders, updateOrder } from "@/api/order"
import type { TOrder } from "@/types/order.types"
import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query"

export const useOrders = (): UseQueryResult => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  })
}
export const useOrder = (id: string): UseQueryResult<TOrder, Error> => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => getOrder(id),
    enabled: !!id,
  })
}
export const useCreateOrder = (): UseMutationResult<TOrder, Error, TOrder> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['createorder'],
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'], exact: true })
    },
  })
}
export const useUpdateOrder = (): UseMutationResult<
  TOrder,
  Error,
  TOrder
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateorder'],
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'], exact: true })
    },
  })
}
export const useDeleteOrder = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['deleteorder'],
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'], exact: true })
    },
  })
}
