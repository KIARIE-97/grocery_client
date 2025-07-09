import { useProduct } from '@/hooks/UseProduct'
import type { TProduct } from '@/types/product.types'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { Badge } from '../ui/badge'
import Error from '../error'
import { TableModal } from '../ui/TableModal'
import { useAuth } from '@/hooks/UseAuth'

function ProductsTable() {
  const [search, setSearch] = useState('')
  const { data: products, error } = useProduct()
  const { isAuthenticated } = useAuth()

  const filteredData = useMemo(
    () =>
      Array.isArray(products)
        ? products.filter(
            (product) =>
              product.product_name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              product.product_description
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              product.size.toLowerCase().includes(search.toLowerCase()),
          )
        : [],
    [products, search],
  )

  const columns: ColumnDef<TProduct>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Name',
      accessorKey: 'product_name',
    },
    {
      header: 'category',
      accessorKey: 'categorys',
      cell: ({ getValue }) => {
        const categories = getValue() as TProduct['categorys'] | TProduct['categorys'][];
        return (
          <div>
            {Array.isArray(categories)
              ? categories.map((category) => (
                  <div key={category.id} className="mb-1">
                    {category.category_name}
                  </div>
                ))
              : categories && (
                  <div className="mb-1">{categories.category_name}</div>
                )}
          </div>
        )
      },
    },
    {
      header: 'Price',
      accessorKey: 'product_price',
      cell: ({ getValue }) => `$${(getValue() as number).toFixed(2)}`,
    },
    {
      header: 'Stock',
      accessorKey: 'stock',
    },
    {
      header: 'Size',
      accessorKey: 'size',
    },
    {
      header: 'Available',
      accessorKey: 'is_available',
      cell: ({ getValue }) => (
        <Badge variant={(getValue() as boolean) ? 'secondary' : 'destructive'}>
          {(getValue() as boolean) ? 'Yes' : 'No'}
        </Badge>
      ),
    },
  ]

  if (error) return <Error error={error} />

  return (
    <div className="p-4 space-y-6">
      <div>
        <label htmlFor="search">Search Products:</label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Search by name, description, or size..."
        />
      </div>

      {isAuthenticated && (
        <TableModal<TProduct>
          data={filteredData}
          columns={columns}
          title="Products"
          modalContent={(item) =>
            item ? (
              <div className="space-y-2">
                <div>ID: {item.id}</div>
                <div>Name: {item.product_name}</div>
                <div>Description: {item.product_description}</div>
                <div>Price: ${item.product_price.toFixed(2)}</div>
                <div>Stock: {item.stock}</div>
                <div>Size: {item.size}</div>
                <div>Available: {item.is_available ? 'Yes' : 'No'}</div>
                <div>
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-32 h-32 object-cover"
                  />
                </div>
              </div>
            ) : null
          }
        />
      )}
    </div>
  )
}

export default ProductsTable
