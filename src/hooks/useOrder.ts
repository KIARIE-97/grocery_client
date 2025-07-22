import { createOrder, deleteOrder, getOrder, getOrders, updateOrder, updateOrderStatus } from "@/api/order"
import type { CheckoutProps, TCartOrder, TOrder } from "@/types/order.types"
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
export const useCreateOrder = ()=> {
  const queryClient = useQueryClient()
  return useMutation<TCartOrder, Error, TCartOrder>({
    mutationKey: ['createorder'],
    mutationFn: (orderData) => createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'], exact: true })
    },
  })
}
export const useUpdateOrder = () => {
  const queryClient = useQueryClient()
  return useMutation<TOrder, Error, CheckoutProps>({
    mutationKey: ['updateorder'],
    mutationFn: (orderData: CheckoutProps) => updateOrder(orderData),
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

export type OStatus = 'PREPARING' | 'READY' | 'DELIVERED' | 'COMPLETED'

interface UpdateOrderStatusInput {
  orderId: string
  status: OStatus
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['update-order-status'],
    mutationFn: ({ orderId, status }: UpdateOrderStatusInput) =>
      updateOrderStatus(orderId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'], exact: true })
      // Optionally: Show a toast or notification to the user
      console.log('Order status updated:', data)
    },
  })
}
