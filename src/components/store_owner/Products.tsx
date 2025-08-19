import { useState } from 'react'

interface Product {
  id: number
  name: string
  price: number
}

const Products = () => {
  const [products] = useState<Product[]>([
    { id: 1, name: 'Sample Product', price: 29.99 },
  ])

  // Add, edit, delete logic here (omitted for brevity)

  return (
    <div>
      <h2 className="text-2xl font-semibold text-accentOrangeDark mb-4">
        Products
      </h2>
      {/* Products list and add/edit form */}
      {/* For example, a simple list: */}
      <ul>
        {products.map((p) => (
          <li key={p.id} className="mb-2">
            {p.name} - ${p.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Products
