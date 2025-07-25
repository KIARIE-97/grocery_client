import Error from '@/components/error'
import GroceryLoader from '@/components/ui/GroceryLoader'
import { TableModal } from '@/components/ui/TableModal'
import { useAuth } from '@/hooks/UseAuth'
import { useCategories } from '@/hooks/useCategory'
import type { TCategory } from '@/types/category.types'
import { createFileRoute, Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/admin/category')({
  component: RouteComponent,
})

function RouteComponent() {
    const [search, setSearch] = useState('')
    const { data: categories, error, isLoading } = useCategories()
    const { isAuthenticated } = useAuth()

    const filteredData = useMemo(
      () =>
        Array.isArray(categories)
          ? categories.filter((cat: TCategory) =>
              cat.category_name.toLowerCase().includes(search.toLowerCase()),
            )
          : [],
      [categories, search],
    )

    const columns: ColumnDef<TCategory>[] = [
      {
        header: 'Category Name',
        accessorKey: 'category_name',
      },
      {
        header: 'Products Count',
        accessorKey: 'products',
        cell: ({ getValue }) => {
          const value = getValue() as unknown;
          return Array.isArray(value) ? value.length : 0;
        },
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
       <Link to="/admin/category">
              <button className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
                <h1 className=" font-bold">Add category</h1>
              </button>
            </Link>
      <div>
        <label htmlFor="search">Search Categories:</label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Search by category name..."
        />
      </div>

      {isAuthenticated && (
        <TableModal<TCategory>
          data={filteredData}
          columns={columns}
          title="Categories"
          modalContent={(item) =>
            item ? (
              <div className="space-y-2">
                <div>Category Name: {item.category_name}</div>
                <div>Products Count: {item.products.length}</div>
                <div>
                  <strong>Products:</strong>
                  <ul className="list-disc ml-4">
                    {item.products.map((prod) => (
                      <li key={prod.id}>{prod.product_name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null
          }
        />
      )}
    </div>
  )
}
