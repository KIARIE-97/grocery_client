import { useCreateOrder } from '@/hooks/useOrder'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/UseAuth'

interface OrderSummaryProps {
  cartItems: any[]
  totalAmount: number
  onBack: () => void
}

export const OrderSummary = ({
  cartItems,
  totalAmount,
  onBack,
}: OrderSummaryProps) => {
  const { user } = useAuth()
  const createOrder = useCreateOrder()
  const navigate = useNavigate()

  const handleProceedToCheckout = async () => {
    const orderData = {
      id: 0,
      customer_id: user?.id ? Number(user.id) : 0,
      product_ids: cartItems.map((item) => item.id),
      total_amount: totalAmount,
      tax_amount: 0,
      payment_method: 'mpesa' as 'mpesa',
      payment_status: 'pending' as 'pending',
      status: 'pending' as 'pending',
      delivery_schedule_at: new Date().toISOString(),
    }

    try {
      createOrder.mutate(orderData, {
        onSuccess: (data) => {
          navigate({
            to: '/customer/checkout',
            search: { orderId: String(data.id) },
          })
        },
        onError: (error) => {
          console.error('Order creation failed:', error)
        },
      })
    } catch (error) {
      console.error('Order creation failed:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="mb-4 space-y-3">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={item.product_image}
                alt={item.product_name}
                className="w-10 h-10 object-cover rounded mr-3"
              />
              <div>
                <p className="font-medium">{item.product_name}</p>
                <p className="text-sm text-gray-600">
                  {item.quantity} × Ksh {item.product_price.toFixed(2)}
                </p>
              </div>
            </div>
            <p className="font-medium">
              Ksh {(item.product_price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">Ksh {totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span className="text-blue-800">Ksh {totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back to Cart
        </button>
        <button
          onClick={handleProceedToCheckout}
          disabled={createOrder.isPending}
          className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-orange-400"
        >
          {createOrder.isPending ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  )
}
