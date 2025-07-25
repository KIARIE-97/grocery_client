import Error from '@/components/error'
import { Badge } from '@/components/ui/badge'
import GroceryLoader from '@/components/ui/GroceryLoader'
import { TableModal } from '@/components/ui/TableModal'
import { useAuth } from '@/hooks/UseAuth'
import { useStores } from '@/hooks/useStore'
import type { TStore } from '@/types/store.types'
import { createFileRoute, Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/admin/stores')({
  component: RouteComponent,
})

function RouteComponent() {
  const [search, setSearch] = useState('')
  const { data: stores, error, isLoading } = useStores()
  const { isAuthenticated } = useAuth()

  const filteredData = useMemo(
    () =>
      Array.isArray(stores)
        ? stores.filter(
            (store: TStore) =>
              store.user.full_name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              store.store_name.toLowerCase().includes(search.toLowerCase()) ||
              store.location.toLowerCase().includes(search.toLowerCase()) ||
              store.status.toLowerCase().includes(search.toLowerCase()),
          )
        : [],
    [stores, search],
  )

  const columns: ColumnDef<TStore>[] = [
    {
      header: 'User',
      accessorKey: 'user',
      cell: ({ getValue }) => (getValue() as TStore['user']).full_name,
    },
    {
      header: 'Store Name',
      accessorKey: 'store_name',
    },
    {
      header: 'Location',
      accessorKey: 'location',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => (
        <Badge variant={getValue() === 'active' ? 'secondary' : 'destructive'}>
          {String(getValue())}
        </Badge>
      ),
    },
  ]

  if (error) return <Error error={error} />
  if (isLoading) return (
    <div className="center m-50">
      <GroceryLoader />
    </div>
  )
  return (
    <div className="p-4 space-y-6 ">
      <Link to="/admin/addstore">
        <button className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
          <h1 className=" font-bold">Add store</h1>
        </button>
      </Link>
      <div>
        <label htmlFor="search">Search Stores:</label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Search by user, store name, location, or status..."
        />
      </div>

      {isAuthenticated && (
        <TableModal<TStore>
          data={filteredData}
          columns={columns}
          title="Stores"
          modalContent={(item) =>
            item ? (
              <div className="space-y-2">
                <div>
                  <strong>User:</strong> {item.user.full_name} (
                  {item.user.email})
                </div>
                <div>
                  <strong>Store Name:</strong> {item.store_name}
                </div>
                <div>
                  <strong>Location:</strong> {item.location}
                </div>
                <div>
                  <strong>Status:</strong> {item.status}
                </div>
              </div>
            ) : null
          }
        />
      )}
    </div>
  )
}
