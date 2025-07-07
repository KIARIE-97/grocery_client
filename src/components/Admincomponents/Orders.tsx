import { Badge } from '@/components/ui/badge'
import type { ColumnDef } from '@tanstack/react-table'
import { TableModal } from '../ui/TableModal'

type Order = {
  orderId: string
  productTitle: string
  date: string
  address: string
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled'
  total: number
}

const orderData: Order[] = [
    {
            orderId: 'ORD0012345',
            productTitle: 'Fresh Organic Apples',
            date: '2023-07-04',
            address: '123 Maple St, Springfield',
            status: 'Pending',
            total: 59.99,
          },
          {
            orderId: 'ORD0012346',
            productTitle: 'Whole Wheat Bread',
            date: '2023-07-04',
            address: '456 Oak Ave, Shelbyville',
            status: 'Completed',
            total: 31.0,
          },
          {
            orderId: 'ORD0012347',
            productTitle: 'Almond Milk',
            date: '2023-07-03',
            address: '789 Pine Ln, Capital City',
            status: 'Processing',
            total: 24.5,
          },
          {
            orderId: 'ORD0012348',
            productTitle: 'Cage-Free Eggs',
            date: '2023-07-02',
            address: '101 Elm Ct, Ogdenville',
            status: 'Cancelled',
            total: 51.0,
          },
]

const orderColumns: ColumnDef<Order>[] = [
  { accessorKey: 'orderId', header: 'Order ID' },
  { accessorKey: 'productTitle', header: 'Product' },
  { accessorKey: 'date', header: 'Date' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Order['status']
      const variant =
        status === 'Pending'
          ? 'destructive'
          : status === 'Processing'
          ? 'default'
          : status === 'Completed'
          ? 'secondary'
          : 'outline'
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: 'total',
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const total = parseFloat(row.getValue('total'))
      return (
        <div className="text-right font-medium">
          ${total.toFixed(2)}
        </div>
      )
    },
  },
]

export default function OrdersPage() {
  return (
    <TableModal
      data={orderData}
      columns={orderColumns}
      title="Recent Orders"
      modalContent={(order) => (
        <>
          <div>Order ID: {order.orderId}</div>
          <div>Product: {order.productTitle}</div>
          <div>Date: {order.date}</div>
          <div>Address: {order.address}</div>
          <div>Status: {order.status}</div>
          <div>Total: ${order.total}</div>
        </>
      )}
    />
  )
}

