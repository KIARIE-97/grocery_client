import React, { useState } from 'react'
import { useStores } from '@/hooks/useStore'
import { useAuth } from '@/hooks/UseAuth'
import { useUpdateOrderStatus } from '@/hooks/useOrder'
import type { TStore } from '@/types/store.types'
import { toast } from 'sonner'

const ORDER_STATUSES = ['PREPARING', 'READY', 'DELIVERED', 'COMPLETED'] as const
type OStatus = (typeof ORDER_STATUSES)[number]

const StoreOwnerOrders: React.FC = () => {
  const { user } = useAuth()
  const { data: stores, isLoading: storesLoading } = useStores()
  const updateStatus = useUpdateOrderStatus()

  // Track edited status per order
  const [editedStatus, setEditedStatus] = useState<Record<string, OStatus>>({})

  if (!user || user.role !== 'store_owner') return <div>Not authorized.</div>
  if (storesLoading) return <div>Loading...</div>
  if (!stores) return <div>No data found.</div>

  // Find stores owned by user
  const storeArray: TStore[] = Array.isArray(stores) ? stores : []
  const myStores = storeArray.filter(
    (store: TStore) => store.user?.id === user.id,
  )

  // Flatten orders across all stores
  const myOrders = myStores.flatMap((store) =>
    (store.orders || []).map((order) => ({
      ...order,
      store_name: store.store_name,
      store_image: store.shop_image,
      store_id: store.id,
    })),
  )
  

  if (myOrders.length === 0) return <div>No orders for your store(s).</div>

  return (
    <div>
      <h2 className="font-bold text-lg mb-4">My Store Orders</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Order ID</th>
            <th className="border px-2 py-1">Store</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Action</th>
            <th className="border px-2 py-1">Date</th>
          </tr>
        </thead>
        <tbody>
          {myOrders.map((order) => (
            <tr key={order.order_id}>
              <td className="border px-2 py-1">{order.order_id}</td>
              <td className="border px-2 py-1">
                <img
                  src={order.store_image}
                  alt="store"
                  style={{ width: 24, height: 24 }}
                />{' '}
                {order.store_name}
              </td>
              <td className="border px-2 py-1">
                <select
                  value={
                    editedStatus[order.order_id] ?? order.status?.toLowerCase()
                  }
                  onChange={(e) =>
                    setEditedStatus((prev) => ({
                      ...prev,
                      [order.order_id]: e.target.value as OStatus,
                    }))
                  }
                  disabled={updateStatus.isPending}
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border px-2 py-1">
                <button
                  className="bg-orange-600 text-white px-2 py-1 rounded"
                  onClick={() =>
                    updateStatus.mutate({
                      orderId: String(order.order_id),
                      status:
                        editedStatus[order.order_id] ??
                        order.status?.toLowerCase(),
                    })
                  }
                  disabled={
                    updateStatus.isPending ||
                    (editedStatus[order.order_id] ??
                      order.status?.toLowerCase()) ===
                      order.status?.toLowerCase()
                  }
                >
                  Save
                </button>
                {updateStatus.isSuccess &&
                  updateStatus.variables?.orderId ===
                    String(order.order_id) && (
                    <>
                      {toast.success('Order status updated successfully!')}
                      {setEditedStatus((prev) => {
                        const copy = { ...prev }
                        delete copy[order.order_id]
                        return copy
                      })}
                    </>
                  )}
                {updateStatus.isError &&
                  updateStatus.variables?.orderId ===
                    String(order.order_id) && (
                    <div className="text-red-500 text-xs">Error!</div>
                  )}
              </td>
              <td className="border px-2 py-1">
                {order.delivery_schedule_at
                  ? new Date(order.delivery_schedule_at).toLocaleString()
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StoreOwnerOrders
