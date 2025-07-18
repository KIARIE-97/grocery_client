import { useAuth } from '@/hooks/UseAuth'
import { useCreateOrder, useOrder } from '@/hooks/useOrder'
import { useCreatePayment } from '@/hooks/usePayment' // Your payment hook
import { useCart } from '@/store/cartStore'
import { useState } from 'react'
import { PaymentForm } from './customer/Checkout'

const CartSidebar = ({ onClose }: { onClose?: () => void }) => {
  const { state, dispatch } = useCart()
  const createOrder = useCreateOrder()
  const { user } = useAuth()
  const [id, setid] = useState<string | null>(null)

  // Fetch order details once id is set
  const {
    data: order,
    isLoading: orderLoading,
    error: orderError,
  } = useOrder(id || '')

  const total = state.items.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0,
  )

  const handleCancelOrder = () => {
    state.items.forEach((item: any) => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })
    })
    setid(null) // reset id on cancel
    if (onClose) onClose()
  }

  const handleCheckout = async () => {
    const cartData = {
      id: 0, 
      customer_id: user?.id ? Number(user.id) : 0,
      product_ids: state.items.map((item) => item.id),
      total_amount: total,
      tax_amount: 0,
      payment_method: "mpesa" as "mpesa", 
      payment_status: 'pending' as 'pending',
      status: 'pending' as 'pending',
      delivery_schedule_at: new Date().toISOString(),
    }

    try {
      createOrder.mutate(cartData, {
        onSuccess: (data) => {
          console.log('Order created successfully:', data)
          setid(String(data.id))
          dispatch({ type: 'CLEAR_CART' })
          // if (onClose) onClose()
        },
        onError: (error: any) => {
          console.error('Order creation failed:', error)
        },
      })
    } catch (error) {
      console.error('Order creation failed:', error)
    }
  }


  console.log( 'Order ID:', id)
  if (id) {
    // Show order summary and payment UI
    if (orderLoading) return <div>Loading order summary...</div>
    if (orderError)
      return (
        <div className="text-red-600">
          Error loading order: {orderError.message}
        </div>
      )

    return (
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="mb-4">
          <div className="flex justify-between">
            <span>Order ID:</span>
            <span>{order?.order_id ?? 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span>Total:</span>
            <span>Ksh {order?.total_amount.toFixed(2)}</span>
          </div>
          {/* Add more order details if needed */}
        </div>

        {/* PaymentForm integration */}
        <PaymentForm
          orderId={id}
          onPaymentSuccess={() => {
            alert('Payment successful!')
            // Optionally clear order id to reset UI or redirect user
            setid(null)
            // Optionally clear cart again or update UI accordingly
          }}
        />

        <button
          className="mt-4 text-gray-500 underline"
          onClick={() => setid(null)}
        >
          Back to Cart
        </button>
      </div>
    )
  }

  // Default: show cart items and checkout button
  return (
    <div className="fixed top-16 right-4 w-96 bg-white shadow-lg rounded-lg p-4 z-40">
      <h2 className="text-lg font-bold mb-4">My Cart</h2>
      {state.items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          {state.items.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-2 border-b"
            >
              <img
                src={item.product_image}
                alt={item.product_name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 ml-2">
                <p className="font-semibold">{item.product_name}</p>
                <p className="text-sm text-gray-600">
                  Ksh {item.product_price} × {item.quantity}
                </p>
              </div>
              <button
                className="text-red-500 text-xs ml-2"
                onClick={() =>
                  dispatch({
                    type: 'REMOVE_FROM_CART',
                    payload: item.id,
                  })
                }
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-4 flex justify-between items-center">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-red-600">
              Ksh {total.toFixed(2)}
            </span>
          </div>
          <div className="mt-6 flex gap-2">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              onClick={handleCancelOrder}
            >
              Cancel Order
            </button>
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              onClick={handleCheckout}
              disabled={createOrder.isPending}
            >
              {createOrder.isPending
                ? 'Creating Order...'
                : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}
      {onClose && (
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
      )}
    </div>
  )
}

export default CartSidebar
