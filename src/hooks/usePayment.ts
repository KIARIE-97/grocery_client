import { createPayment, getPaymentsByUser } from '@/api/payment'
import type { TPayment } from '@/types/payment.tpyes'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useCreatePayment = () => {
  const queryClient = useQueryClient()
  return useMutation<TPayment, Error, TPayment>({
    mutationKey: ['createpayment'],
    mutationFn: (paymentData) => {
      if (!paymentData.orderId) {
        throw new Error('orderId is required for creating a payment');
      }
      return createPayment(paymentData.orderId, paymentData);
    },
    onSuccess: (data) => {
      console.log('Product created successfully', data)
      queryClient.invalidateQueries({ queryKey: ['payments'], exact: true })
    },
  })
}

export const usePaymentsByUser = (userId: number) => {
  return useQuery({
    queryKey: ['payments', userId],
    queryFn: () => getPaymentsByUser(userId),
    enabled: !!userId,
  })
}