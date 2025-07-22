import { useOrder } from '@/hooks/useOrder'
import { CheckCircle, Mail, MapPin, Phone, Wallet } from 'lucide-react'
import { format } from 'date-fns'

type OrderPlacedProps = {
  orderId: string
}

export default function OrderPlaced({ orderId }: OrderPlacedProps) {
  const { data: order, isLoading, error } = useOrder(orderId)

  if (isLoading) return <div className="text-center py-10">Loading...</div>
  if (error || !order)
    return (
      <div className="text-center py-10 text-red-500">Something went wrong</div>
    )

  const deliveryTime = format(new Date(order.delivery_schedule_at), 'h:mmaaa')
  const createdTime = format(new Date(order.created_at), 'h:mmaaa')

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex flex-col items-center justify-center">
        <CheckCircle className="text-orange-500 w-14 h-14 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">
          Order Successfully Placed
        </h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Thank you for your order! You will receive your order between{' '}
          <strong>
            Today, {createdTime} - {deliveryTime}
          </strong>
        </p>

        <div className="bg-white shadow rounded-lg w-full">
          <div className="border-b p-4 flex items-center gap-2 text-sm font-medium text-gray-700">
            <Mail className="text-orange-500 w-5 h-5" />
            Your order will be sent to this address
          </div>

          <div className="p-4 space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1" />
              <span>
                Address:{' '}
                <span className="font-medium">
                  #000, St 8, Sks Nagar, Near Pakhowal Road, Ldh, 141001
                </span>
              </span>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 mt-1" />
              <span>
                Phone Number:{' '}
                <span className="font-medium">
                  {order.customer?.phone_number}
                </span>
              </span>
            </div>

            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-1" />
              <span>
                Email Address:{' '}
                <span className="font-medium">{order.customer?.email}</span>
              </span>
            </div>

            <div className="flex items-start gap-2">
              <Wallet className="w-4 h-4 mt-1" />
              <span>
                Payment Method:{' '}
                <span className="capitalize font-medium">
                  {order.payment_method}
                </span>
              </span>
            </div>
          </div>

          <div className="border-t px-4 py-3 flex justify-between items-center text-sm">
            <span className="text-gray-700">Stay Home 😊</span>
            <button className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600 transition">
              Invoice
            </button>
          </div>

          <div className="border-t px-4 py-3 text-sm text-center text-gray-700">
            The payment of{' '}
            <span className="text-orange-600 font-semibold">
              ${order.total_amount}
            </span>{' '}
            you'll make when the deliver arrives with your order.
          </div>
        </div>
      </div>
    </div>
  )
}
