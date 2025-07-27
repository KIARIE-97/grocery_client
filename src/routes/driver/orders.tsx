import GroceryLoader from '@/components/ui/GroceryLoader'
import { OrderMapModal } from '@/components/ui/OrderMapModal'
import { useAssignOrderToDriver, useGenerateDeliveryOtp, useOrders, useUpdateOrderStatus, useVerifyDeliveryOtp } from '@/hooks/useOrder'
import { useStore } from '@/hooks/useStore'
import { authStore } from '@/store/authStore'
import type { TOrder } from '@/types/order.types'
import type { TStore } from '@/types/store.types'
import { createFileRoute } from '@tanstack/react-router'
import { Truck, Clock, MapPin, Loader2, PackageCheck, List } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/driver/orders')({
  component: DriverOrders,
})

function DriverOrders() {
  const { data: orders, isLoading, error, refetch } = useOrders()
  const updateOrderStatus = useUpdateOrderStatus()
  const assignOrder = useAssignOrderToDriver()
  const auth = authStore
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'available' | 'my'>('available')

  const driverId = auth.state.driver?.id

  // Filter orders based on tab selection
  const availableOrders = Array.isArray(orders)
    ? orders.filter((order: TOrder) => order.status === 'ready')
    : []

  const myOrders = Array.isArray(orders)
    ? orders.filter((order: TOrder) => 
        order.driver?.id === driverId && 
        ['out_for_delivery', 'accepted'].includes(order.status)
    )
    : []

//  const handleTakeOrder = (orderId: number) => {
//    if (!driverId) {
//      console.error('Driver ID is missing')
//      return
//    }

//    // Convert to proper types
//    const stringOrderId = String(orderId)
//    const numericDriverId = Number(driverId)

//    assignOrder.mutate(
//      {
//        orderId: stringOrderId,
//        driverId: numericDriverId,
//      },
//      {
//        onSuccess: () => {
//          updateOrderStatus.mutate(
//            {
//              orderId: stringOrderId,
//              status: 'out_for_delivery',
//            },
//            {
//              onSuccess: () => {
//                refetch()
//                toast.success('Order assigned successfully!')
//              },
//              onError: (error) => {
//                toast.error(`Status update failed: ${error.message}`)
//              },
//            },
//          )
//        },
//        onError: (error) => {
//          toast.error(`Assignment failed: ${error.message}`)
//        },
//      },
//    )
//  }
const handleTakeOrder = async (orderId: number) => {
  try {
    if (!driverId) {
      toast.error('Driver authentication failed')
      return
    }

    // First update the status
    await updateOrderStatus.mutateAsync({
      orderId: String(orderId),
      status: 'out_for_delivery',
    })

    // Then assign the driver
    await assignOrder.mutateAsync({
      orderId: String(orderId),
      driverId: Number(driverId),
    })

    refetch()
    toast.success('Order assigned successfully!')
  } catch (error) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: string }).message
        : String(error)
    toast.error(`Failed to assign order: ${errorMessage}`)
    console.error('Assignment error:', error)
  }
}
  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
  }

  if (isLoading) {
    return (
      <div className="center m-50">
        <GroceryLoader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p>Error loading orders: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
            {activeTab === 'available' ? (
              <>
                <Truck className="text-green-600" />
                <span className="text-green-800 font-medium">
                  {availableOrders.length} orders available
                </span>
              </>
            ) : (
              <>
                <PackageCheck className="text-orange-600" />
                <span className="text-orange-800 font-medium">
                  {myOrders.length} assigned orders
                </span>
              </>
            )}
          </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('available')}
          className={`py-2 px-4 font-medium text-sm flex items-center gap-2 ${
            activeTab === 'available'
              ? 'border-b-2 border-orange-500 text-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <List className="w-4 h-4" />
          Available Orders
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`py-2 px-4 font-medium text-sm flex items-center gap-2 ${
            activeTab === 'my'
              ? 'border-b-2 border-orange-500 text-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          My Orders
        </button>
      </div>

      {/* Orders List */}
      {activeTab === 'available' ? (
        availableOrders.length === 0 ? (
          <div className="bg-orange-50 border-l-4 border-orange-500 text-orange-700 p-4 rounded">
            <p>No orders are currently ready for delivery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableOrders.map((order: TOrder) => (
              <OrderCard
                key={order.order_id}
                order={order}
                isExpanded={expandedOrderId === order.order_id}
                onTakeOrder={handleTakeOrder}
                onToggleDetails={toggleOrderDetails}
                isAssigned={false}
                isTakingOrder={assignOrder.isPending}
              />
            ))}
          </div>
        )
      ) : myOrders.length === 0 ? (
        <div className="bg-orange-50 border-l-4 border-orange-500 text-orange-700 p-4 rounded">
          <p>You don't have any assigned orders yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myOrders.map((order: TOrder) => (
            <OrderCard
              key={order.order_id}
              order={order}
              isExpanded={expandedOrderId === order.order_id}
              onToggleDetails={toggleOrderDetails}
              isAssigned={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface OrderCardProps {
  order: TOrder
  isExpanded: boolean
  onTakeOrder?: (orderId: number) => void
  onToggleDetails: (orderId: number) => void
  isAssigned: boolean
  isTakingOrder?: boolean
}

function OrderCard({
  order,
  isExpanded,
  onTakeOrder,
  onToggleDetails,
  isAssigned,
  isTakingOrder = false,
}: OrderCardProps) {
  const storeId = order.store?.id
  const { data: store, isLoading: storeLoading } = useStore(storeId || '') as {
    data: TStore | undefined
    isLoading: boolean
  }
  // const { data: store, isLoading: storeLoading } = useStore(order.store.id ?? '') as { data: TStore | undefined, isLoading: boolean }
const [otp, setOtp] = useState('')
const [showOtpInput, setShowOtpInput] = useState(false)
const generateOtp = useGenerateDeliveryOtp()
const verifyOtp = useVerifyDeliveryOtp()

const [isMapOpen, setIsMapOpen] = useState(false)

  const statusColors: Record<TOrder['status'], string> = {
    pending: 'bg-gray-100 text-gray-800',
    preparing: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-orange-100 text-orange-800',
    ready_for_pickup: 'bg-cyan-100 text-cyan-800',
    out_for_delivery: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    delivered: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800',
    failed: 'bg-red-100 text-red-800',
  }
const handleMarkAsDelivered = async () => {
  if (showOtpInput) {
    try {
      await verifyOtp.mutateAsync({ orderId: String(order.order_id), otp })
      toast.success('Delivery verified successfully!')
      setShowOtpInput(false)
      // You might want to refresh orders here
    } catch (error) {
      toast.error('Invalid OTP. Please try again.')
    }
  } else {
    try {
      await generateOtp.mutateAsync(String(order.order_id))
      toast.success('OTP sent to customer. Please ask for the code.')
      setShowOtpInput(true)
    } catch (error) {
      toast.error('Failed to generate OTP. Please try again.')
    }
  }
}
console.log('order address', order.delivery_address)
console.log('order object', order)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                statusColors[order.status] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="mt-4">
            <button
              onClick={() => onToggleDetails(order.order_id)}
              className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center"
            >
              {isExpanded ? 'Hide details' : 'View details'}
              <svg
                className={`ml-1 w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isExpanded && (
              <div className="mt-3 space-y-3">
                <div className="border-t border-gray-100 pt-3">
                  <h4 className="font-medium text-gray-700">Order Summary:</h4>
                  <ul className="mt-2 space-y-1">
                    {order.products.map((product, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>{product.product_name}</span>
                        <span className="text-gray-500">
                          x{product.quantity} (KES
                          {product.product_price.toFixed(2)})
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <h4 className="font-medium text-gray-700">
                    Delivery Address:
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.delivery_address?.addressLine1
                      ? `${order.delivery_address.addressLine1}, `
                      : ''}
                    {order.delivery_address?.city || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.delivery_address?.state || 'N/A'},{' '}
                    {order.delivery_address?.country || 'N/A'}
                  </p>
                </div>

                {storeLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="animate-spin text-orange-500 w-5 h-5" />
                  </div>
                ) : store ? (
                  <div className="border-t border-gray-100 pt-3">
                    <h4 className="font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      Pickup Location
                    </h4>
                    <div className="mt-2 text-sm">
                      <p className="font-medium">{store.store_name}</p>
                      <p className="text-gray-600">{store.location}</p>
                      {/* <a
                        href={`https://maps.google.com/?q=${store.location}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:underline inline-flex items-center mt-1"
                      >
                        View on map
                        
                      </a> */}
                      <a
                        onClick={() => setIsMapOpen(true)}
                        className="text-orange-600 hover:underline inline-flex items-center mt-1 cursor-pointer"
                      >
                        View on map
                      </a>

                      {isMapOpen && (
                        <OrderMapModal
                          isOpen={isMapOpen}
                          onClose={() => setIsMapOpen(false)}
                          pickupLocation={store?.location || ''}
                          deliveryLocation={
                            order.delivery_address?.addressLine1
                              ? `${order.delivery_address.addressLine1}, ${order.delivery_address.city}, ${order.delivery_address.country}`
                              : ''
                          }
                          storeName={store?.store_name || 'Store'}
                          customerName={order.customer?.full_name || 'Customer'}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Store information not available
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  Scheduled for:{' '}
                  {new Date(order.delivery_schedule_at).toLocaleString()}
                </div>
              </div>
            )}
            {!isAssigned && onTakeOrder && (
              <button
                onClick={() => onTakeOrder(order.order_id)}
                disabled={isTakingOrder}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-70"
              >
                {isTakingOrder ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    Take Order
                  </>
                )}
              </button>
            )}
            {isAssigned && order.status === 'out_for_delivery' && (
              <div className="p-4 border-t border-gray-100">
                {showOtpInput ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP from customer"
                      className="w-full p-2 border rounded-md"
                      maxLength={6}
                    />
                    <button
                      onClick={handleMarkAsDelivered}
                      disabled={verifyOtp.isPending}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md disabled:opacity-70"
                    >
                      {verifyOtp.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin w-4 h-4" />
                          Verifying...
                        </span>
                      ) : (
                        'Verify Delivery'
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleMarkAsDelivered}
                    disabled={generateOtp.isPending}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md disabled:opacity-70"
                  >
                    {generateOtp.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" />
                        Generating OTP...
                      </span>
                    ) : (
                      'Mark as Delivered'
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}