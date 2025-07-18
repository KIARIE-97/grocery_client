import { useAuth } from "@/hooks/UseAuth"
import { useSingleCustomer } from "@/hooks/useUser"
import type { ICustomer } from "@/types/user.types"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { OrderPDF } from "../ui/OrderPDF"


const OrderDetail = () => {
  const { user } = useAuth()

  const {
    data: customerData,
    isLoading,
    error,
  } = useSingleCustomer(user?.id ?? '') as {
    data: ICustomer | undefined
    isLoading: boolean
    error: unknown
  }
 

  if (isLoading) return <div className="p-4">Loading orders...</div>
  if (error || !customerData)
    return <div className="p-4">Could not load orders.</div>
         console.log('Customer Data:', customerData.orders) // Debugging line to check customerData

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {customerData.orders.map((order) => (
    
        <div
          key={order.id}
          className="bg-white rounded shadow p-4 mb-6 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="font-semibold">{order.delivery_schedule_at}</p>
              <p className="text-gray-500 text-sm">GrocerJet - kutus</p>
              <p className="text-gray-500 text-sm">Delivered - GrocerJet</p>
              <p className="text-gray-500 text-sm">
                {order.products?.length ?? 0} items
              </p>
            </div>
            <div className="text-lg font-bold text-orange-500">
              KES {order.total_amount}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
            <div className="flex justify-between">
              <span>Sub Total</span>
              <span>KES{order.total_amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>KES{order.total_amount}</span>
            </div>
          </div>

          <div className="mt-4 mb-3">
            <p className="font-medium text-sm mb-1 text-gray-700">
              Track Order
            </p>
            <div className="flex space-x-2">
              {[
                'pending',
                'accepted',
                'out_for_delivery',
                'Delivered',
                'cancelled',
                'failed',
              ].map((stage, index) => (
                <div
                  key={index}
                  className={`px-3 py-1 rounded-full text-xs ${
                    stage.toLowerCase() === order.status
                      ? 'bg-orange-100 text-orange-700 font-semibold border border-orange-300'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stage}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <p>
              Cashback of ksh.50 will be credited to GrocerJet wallet in 12
              hours of delivery.
            </p>
            {customerData?.orders.length > 0 && (
              <PDFDownloadLink
                document={
                  <OrderPDF
                    full_name={customerData.full_name}
                    email={customerData.email}
                    orders={customerData.orders}
                    logoUrl="https://static.vecteezy.com/system/resources/previews/022/835/664/original/modern-logo-vegetable-in-shopping-cart-for-grocery-delivery-logo-design-vector.jpg"
                  />
                }
                fileName="orders.pdf"
              >
                {({ loading }) =>
                  loading ? (
                    'Preparing PDF...'
                  ) : (
                    <button className="mb-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                      Export Orders
                    </button>
                  )
                }
              </PDFDownloadLink>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderDetail
