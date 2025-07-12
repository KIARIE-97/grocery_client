import React, { useState } from 'react'
import { useProduct } from '@/hooks/UseProduct'
import ProductDetails from './ProductDetails'
import { useNavigate } from '@tanstack/react-router'

type TProduct = {
  id: number
  product_name: string
  product_description: string
  product_price: number
  product_image: string | null
}

const Products: React.FC = () => {
  const { data: products, isLoading, error } = useProduct() as { data: TProduct[]; isLoading: boolean; error: unknown }
  const [selectedId, setSelectedId] = useState<string | null>(null)
//   const navigate = useNavigate()

  const handleProductClick = (id: number) => {
    setSelectedId(id.toString())
    // navigate({ to: '/productdetails', params: { id: id.toString() } })
  }

  if (isLoading)
    return <div className="p-4 text-center">Loading products...</div>
  if (error || !products)
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load products.
      </div>
    )

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Vegetables & Fruits</h1>

      {selectedId ? (
         (() => {
    console.log('Passing productId to ProductDetails:', selectedId)
    return <ProductDetails productId={selectedId} />
  })()
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product: TProduct) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)
                }
                className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition duration-200"
              >
                <img
                  src={
                    product.product_image ??
                    'https://gardenfishcorner.pk/wp-content/uploads/2021/02/king-fish-2-768x979.jpg'
                  }
                  alt={product.product_name}
                  className="w-60 h-60 object-cover mb-3"
                />
                <h4 className="font-semibold text-lg">
                  {product.product_name}
                </h4>
                <p className="text-red-600 font-bold">
                  Ksh {product.product_price}
                </p>
              </div>
            ))}
          </div>

          <button className="mt-6 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            Show More
          </button>
        </>
      )}
    </div>
  )
}

export default Products
