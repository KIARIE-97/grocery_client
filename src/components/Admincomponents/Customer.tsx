import { useCustomer } from "@/hooks/useUser"
import type { TUserData } from "@/types/user.types"
import type { ColumnDef } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { Badge } from "../ui/badge"
import Error from "../error"
import { TableModal } from "../ui/TableModal"
import { useAuth } from "@/hooks/UseAuth"

function CustomersTable() {
  const [search, setSearch] = useState('')
  const { data: customers, error } = useCustomer()
  const { isAuthenticated } = useAuth()

  const filteredData = useMemo(
    () =>
      Array.isArray(customers)
        ? customers.filter(
            (user: TUserData) =>
              user.full_name.toLowerCase().includes(search.toLowerCase()) ||
              user.email.toLowerCase().includes(search.toLowerCase()) ||
              user.phone_number.toLowerCase().includes(search.toLowerCase()),
          )
        : [],
    [customers, search],
  )

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
        <Badge variant={(getValue() as boolean) ? 'secondary' : 'destructive'}>
          {(getValue() as boolean) ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ]

  if (error) return <Error error={error} />

  return (
    <div className="p-4 space-y-6">
      <div>
        <label htmlFor="search">Search Customers:</label>
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
          title="Customers"
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

export default CustomersTable