import Error from '@/components/error'
import { Badge } from '@/components/ui/badge'
import GroceryLoader from '@/components/ui/GroceryLoader'
import { TableModal } from '@/components/ui/TableModal'
import { useAuth } from '@/hooks/UseAuth'
import { useDrivers } from '@/hooks/useUser'
import type { TDriver, TUserData } from '@/types/user.types'
import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/admin/drivers')({
  component: RouteComponent,
})

function RouteComponent() {
  const [search, setSearch] = useState('')
    const { data, error, isLoading } = useDrivers()
    const { isAuthenticated } = useAuth()
 const drivers = data || [] 

const [filteredData, setFilteredData] = useState<TUserData[]>([])

useEffect(() => {
  if (Array.isArray(drivers)) {
    const filtered = drivers.filter((driver: TDriver) =>
      driver.user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      driver.user.email.toLowerCase().includes(search.toLowerCase()) ||
      driver.user.phone_number.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredData(filtered.map(driver => driver.user))
  } else {
    setFilteredData([])
  }
},[data, search])
console.log('Filtered drivers:', filteredData)
    const columns: ColumnDef<TUserData>[] = [
      {
        header: 'Full Name',
        accessorKey: 'full_name',
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'Phone Number',
        accessorKey: 'phone_number',
      },
      {
        header: 'Active',
        accessorKey: 'is_active',
        cell: ({ getValue }) => (
          <Badge
            variant={(getValue() as boolean) ? 'secondary' : 'destructive'}
          >
            {(getValue() as boolean) ? 'Active' : 'Inactive'}
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
    <div className="p-4 space-y-6">
          <div>
            <label htmlFor="search">Search drivers:</label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Search by name, email, or phone..."
            />
          </div>
    
          {isAuthenticated && (
            <TableModal<TUserData>
              data={filteredData}
              columns={columns}
              title="drivers"
              modalContent={(item) =>
                item ? (
                  <div className="space-y-2">
                    <div>Full Name: {item.full_name}</div>
                    <div>Email: {item.email}</div>
                    <div>Phone: {item.phone_number}</div>
                    <div>Status: {item.is_active ? 'Active' : 'Inactive'}</div>
                  </div>
                ) : null
              }
            />
          )}
        </div>
  )
}
