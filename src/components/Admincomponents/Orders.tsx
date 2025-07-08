import { useOrders } from "@/hooks/useOrder"
import { authStore } from "@/store/authStore"
import type { TOrder } from "@/types/order.types"
import { useStore } from "@tanstack/react-store"
import type { ColumnDef } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { Badge } from "../ui/badge"
import Error from "../error"
import { TableModal } from "../ui/TableModal"

function OrdersTable() {
  const [search, setSearch] = useState('')
  const { data: orders, error } = useOrders()
  const signedIn = useStore(authStore, (state) => state.isAuthenticated)

  const filteredData = useMemo(
    () =>
      Array.isArray(orders)
        ? orders.filter(
            (order) =>
              order?.productTitle
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
              order?.address?.toLowerCase().includes(search.toLowerCase()) ||
              order?.status?.toLowerCase().includes(search.toLowerCase()),
          )
        : [],
    [orders, search],
  )

  const columns: ColumnDef<TOrder>[] = [
    {
      header: 'Order ID',
      accessorKey: 'order_id',
    },
    {
      header: 'Product',
      accessorKey: 'products',
    },
    {
      header: 'Date',
      accessorKey: 'delivery_schedule_at',
      cell: ({ getValue }) =>
        new Date(getValue() as string).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const value = getValue() as string
        return (
          <Badge
            variant={
              value === 'cancelled'
                ? 'destructive'
                : value === 'pending'
                  ? 'default'
                  : value === 'delivered'
                    ? 'secondary'
                    : 'outline'
            }
          >
            {value}
          </Badge>
        )
      },
    },
    {
      header: 'Total',
      accessorKey: 'total_amount',
      cell: ({ getValue }) => `$${(getValue() as number).toFixed(2)}`,
    },
  ]

  if (error) return <Error error={error} />

  return (
    <div className="p-4 space-y-6">
      <div>
        <label htmlFor="search">Search Orders:</label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Search by product, address, or status..."
        />
      </div>

      {signedIn && (
        <TableModal<TOrder>
          data={filteredData}
          columns={columns}
          title="Orders"
          modalContent={(item) =>
            item ? (
              <div className="space-y-2">
                <div>Order ID: {item.order_id}</div>
                <div>Product: {item.products}</div>
                <div>
                  Date:{' '}
                  {new Date(item.delivery_schedule_at).toLocaleDateString()}
                </div>
                <div>Tax: {item.tax_amount}</div>
                <div>Status: {item.status}</div>
                <div>Total: ${item.total_amount.toFixed(2)}</div>
              </div>
            ) : null
          }
        />
      )}
    </div>
  )
}
export default OrdersTable
