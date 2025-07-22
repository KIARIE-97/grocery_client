import React, { useState } from 'react'
import { useStoreOrders, useStores } from '@/hooks/useStore'
import { useAuth } from '@/hooks/UseAuth'
import { useUpdateOrderStatus } from '@/hooks/useOrder'
import type { TStore } from '@/types/store.types'
import { toast } from 'sonner'
import { View } from 'lucide-react'

const ORDER_STATUSES = ['PREPARING', 'READY', 'DELIVERED', 'COMPLETED'] as const
type OStatus = (typeof ORDER_STATUSES)[number]

const StoreOwnerOrders: React.FC = () => {
  const { user } = useAuth()
  const { data: stores, isLoading: storesLoading } = useStores()
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null)

  // Find stores owned by user
  const myStores: TStore[] = Array.isArray(stores)
    ? stores.filter((store: TStore) => store.user?.id === user?.id)
    : []

  // Set default selected store when stores load
  React.useEffect(() => {
    if (myStores.length > 0 && selectedStoreId === null) {
      setSelectedStoreId(Number(myStores[0].id))
    }
  }, [myStores, selectedStoreId])

  const {
    data: orders,
    isLoading: ordersLoading,
    error,
  } = useStoreOrders(selectedStoreId ?? 0)

  const updateStatus = useUpdateOrderStatus()
  const [editedStatus, setEditedStatus] = useState<Record<string, OStatus>>({})

  React.useEffect(() => {
    if (updateStatus.isSuccess && updateStatus.variables?.orderId) {
      setEditedStatus((prev) => {
        const copy = { ...prev }
        copy[updateStatus.variables.orderId] = updateStatus.variables.status
        return copy
      })
    }
  }, [updateStatus.isSuccess, updateStatus.variables])

  // --- UI rendering logic ---
  let content: React.ReactNode = null
  if (!user || user.role !== 'store_owner') {
    content = <div>Not authorized.</div>
  } else if (storesLoading) {
    content = <div>Loading stores...</div>
  } else if (!myStores.length) {
    content = <div>You have no stores.</div>
  } else if (ordersLoading) {
    content = <div>Loading orders...</div>
  } else if (!orders || !Array.isArray(orders) || orders.length === 0) {
    content = <div>No orders for this store.</div>
  } else {
    content = (
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Order ID</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Current Status</th>
            <th className="border px-2 py-1">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr key={order.order_id}>
              <td className="border px-2 py-1">{order.order_id}</td>
              <td className="border px-2 py-1">
                <select
                  value={
                    editedStatus[order.order_id] !== undefined
                      ? editedStatus[order.order_id]
                      : order.status?.toUpperCase()
                  }
                  onChange={(e) =>
                    setEditedStatus((prev) => ({
                      ...prev,
                      [order.order_id]: e.target.value as OStatus,
                    }))
                  }
                  disabled={updateStatus.isPending}
                >
                  <option value="PREPARING">Preparing</option>
                  <option value="READY">Ready</option>
                </select>

                <button
                  className="bg-orange-600 text-white px-2 py-1 rounded"
                  onClick={() =>
                    updateStatus.mutate({
                      orderId: String(order.order_id),
                      status:
                        editedStatus[order.order_id] !== undefined
                          ? editedStatus[order.order_id]
                          : order.status?.toUpperCase(),
                    })
                  }
                  disabled={
                    updateStatus.isPending ||
                    (editedStatus[order.order_id] !== undefined
                      ? editedStatus[order.order_id]
                      : order.status?.toUpperCase()) ===
                      order.status?.toUpperCase()
                  }
                >
                  Save
                </button>
                {updateStatus.isError &&
                  updateStatus.variables?.orderId ===
                    String(order.order_id) && (
                    <div className="text-red-500 text-xs">Error!</div>
                  )}
              </td>
              <td className="border px-2 py-1">
                {/* Current Status column */}
                {editedStatus[order.order_id] !== undefined
                  ? editedStatus[order.order_id]
                  : order.status?.toUpperCase()}
              </td>
              <td className="border px-2 py-1">
                {order.delivery_schedule_at
                  ? new Date(order.delivery_schedule_at).toLocaleString()
                  : '-'}
              </td>
              <td className="border px-2 py-1">
                <button
                  className=" text-orange-300 px-2 py-1 rounded"
                  onClick={() => {
                     setSelectedOrder(order)
                     setModalOpen(true)
                    // Here you can implement the logic to show order details
                  }}
                >
                  <View />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="border px-2 py-1">
              Total Orders: {orders.length}
            </td>
          </tr>
        </tfoot>
      </table>
    )
  }

  return (
    <div>
      <h2 className="font-bold text-lg mb-4">My Store Orders</h2>
      {/* Store selection dropdown */}
      <div className="mb-4">
        <label htmlFor="store-select" className="mr-2 font-semibold">
          Select Store:
        </label>
        <select
          id="store-select"
          value={selectedStoreId ?? ''}
          onChange={(e) => setSelectedStoreId(Number(e.target.value))}
          className="border px-2 py-1"
        >
          {myStores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.store_name}
            </option>
          ))}
        </select>
      </div>
      {content}
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

export default StoreOwnerOrders