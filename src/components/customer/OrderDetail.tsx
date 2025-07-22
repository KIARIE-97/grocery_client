import { useAuth } from "@/hooks/UseAuth"
import { useSingleCustomer } from "@/hooks/useUser"
import type { ICustomer } from "@/types/user.types"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { OrderPDF } from "../ui/OrderPDF"
import { useState } from "react"


const OrderDetail = () => {
  const { user } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)

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
  if (modalOpen && selectedOrder) {
           console.log('Selected Order:', selectedOrder)
         }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {customerData.orders.length > 0 && (
        <div className="mb-6">
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
                <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                  Export Orders
                </button>
              )
            }
          </PDFDownloadLink>
        </div>
      )}

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
                'preparing',
                'ready',
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
            <div className="flex justify-end mt-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => {
                  setSelectedOrder(order)
                  setModalOpen(true)
                }}
              >
                View
              </button>
            </div>
          </div>
        </div>
      ))}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="mb-2">
              <span className="font-semibold">Status:</span>{' '}
              {selectedOrder.status}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Payment Status:</span>{' '}
              {selectedOrder.payment_status ?? 'N/A'}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Products:</span>
              {selectedOrder.products && selectedOrder.products.length > 0 ? (
                <ul className="mt-2 space-y-3">
                  {selectedOrder.products.map((product: any) => (
                    <li
                      key={product.id}
                      className="flex items-center space-x-3"
                    >
                      {product.product_image && (
                        <img
                          src={product.product_image}
                          alt={product.product_name}
                          className="w-12 h-12 object-cover rounded border"
                        />
                      )}
                      <div>
                        <div className="font-semibold">
                          {product.product_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Price: KES {product.product_price}
                        </div>
                        <div className="text-xs text-gray-400">
                          Quantity: {product.quantity}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-2 text-gray-400 text-sm">
                  No products found for this order.
                </div>
              )}
            </div>
            <div className="mt-4 text-right">
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetail
