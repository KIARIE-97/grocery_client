import React, { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import Modal from '../ui/Modal'

// Define a type for our order data
type Order = {
  orderId: string
  productTitle: string
  date: string
  address: string
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled'
  total: number
}

// Sample data conforming to the Order type
const data: Order[] = [
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

// Type the columns array with ColumnDef<Order>
export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'orderId',
    header: 'Order ID',
  },
  {
    accessorKey: 'productTitle',
    header: 'Product',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Order['status']
      const getStatusVariant = () => {
        switch (status) {
          case 'Pending':
            return 'destructive'
          case 'Processing':
            return 'default'
          case 'Completed':
            return 'secondary'
          case 'Cancelled':
            return 'outline'
          default:
            return 'default'
        }
      }
      return <Badge variant={getStatusVariant()}>{status}</Badge>
    },
  },
  {
    accessorKey: 'total',
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: 'actions',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View order details</DropdownMenuItem>
          <DropdownMenuItem>View customer</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

const Orders: React.FC = () => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4">
        <h3 className="font-semibold leading-none tracking-tight">
          Recent Orders
        </h3>
      </div>
      <div className="w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                  <td className="p-4 align-middle">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(row.original)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
          <Modal
            open={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            title="Order Details"
          >
            {selectedOrder && (
              <div>
                <div>Order ID: {selectedOrder.orderId}</div>
                <div>Product: {selectedOrder.productTitle}</div>
                <div>Date: {selectedOrder.date}</div>
                <div>Address: {selectedOrder.address}</div>
                <div>Status: {selectedOrder.status}</div>
                <div>Total: ${selectedOrder.total}</div>
              </div>
            )}
          </Modal>
        </table>
      </div>
    </div>
  )
}

export default Orders
