import { createPayment } from "@/api/payment"
import type { TPayment } from "@/types/payment.tpyes"
import { useMutation, useQueryClient } from "@tanstack/react-query"


export const useCreatePayment = () => {
    const queryClient = useQueryClient()
    return useMutation<TPayment, Error, TPayment>({
      mutationKey: ['createpayment'],
      mutationFn: (paymentData) => createPayment(paymentData.orderId, paymentData),
      onSuccess: (data) => {
          console.log('Product created successfully', data)
        queryClient.invalidateQueries({ queryKey: ['payments'], exact: true })
      },
    })
}