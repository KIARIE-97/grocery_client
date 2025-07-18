import React, { useState } from 'react'
import { useOrder } from '@/hooks/useOrder'
import { useCreatePayment } from '@/hooks/usePayment'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type PaymentFormProps = {
  orderId: string
  onPaymentSuccess?: (payment: any) => void
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  orderId,
  onPaymentSuccess,
}) => {
  const { data: order, isLoading: orderLoading } = useOrder(orderId)
  const createPayment = useCreatePayment()

  const [showPhoneDialog, setShowPhoneDialog] = useState(false)
  const [phone_number, setPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('mpesa') // or card, etc.

  // Handle payment submission
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone_number) {
      setShowPhoneDialog(true)
      return
    }
    createPayment.mutate(
      {
        orderId,
        phone_number,
        amount: order?.total_amount || 0,
        paymentMethod,
      },
      {
        onSuccess: (payment) => {
          onPaymentSuccess?.(payment)
        },
      },
    )
  }

  if (orderLoading) return <div>Loading order...</div>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment</h2>
      <form onSubmit={handlePayment} className="flex flex-col gap-4">
        {/* Phone input trigger */}
        <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-blue-600 underline"
              onClick={() => setShowPhoneDialog(true)}
            >
              {phone_number
                ? `phone_number: ${phone_number}`
                : 'Add phone number'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Phone Number</DialogTitle>
            </DialogHeader>
            <Input
              type="tel"
              value={phone_number}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +2547xxxxxxx"
              autoFocus
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPhoneDialog(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  type="button"
                  onClick={() => setShowPhoneDialog(false)}
                  disabled={!phone_number}
                >
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment method (expand as needed) */}
        <div>
          <label className="block mb-1 font-medium">Payment Method</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="mpesa">M-Pesa</option>
            <option value="card">Card</option>
            {/* Add other options */}
          </select>
        </div>

        <Button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={createPayment.isPending}
        >
          {createPayment.isPending ? 'Processing Payment...' : 'Pay Now'}
        </Button>
        {createPayment.isError && (
          <div className="text-red-600 text-sm">
            {createPayment.error?.message || 'Payment failed. Try again.'}
          </div>
        )}
      </form>
    </div>
  )
}
