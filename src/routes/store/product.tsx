import { createFileRoute } from '@tanstack/react-router'
import { Star, StarOff, ShoppingCart } from 'lucide-react'
import { useStore, useStores } from '@/hooks/useStore'
import { useAuth } from '@/hooks/UseAuth'
import type { TProduct } from '@/types/product.types'
import { useState } from 'react'
import { ProductModal } from '@/components/ui/ProductModal'

export const Route = createFileRoute('/store/product')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()
  const {
    data: stores,
    isLoading: storesLoading,
    isError: storesError,
  } = useStores()
const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null)
  const myStore = (Array.isArray(stores) ? stores : []).find((store: any) => store.user?.id === user?.id)
  const storeId = myStore?.id ?? ''
  const { data: store, isLoading, isError } = useStore(storeId) as {
    data: { products: TProduct[] } | undefined
    isLoading: boolean
    isError: boolean
  }
  if (!user || user.role !== 'store_owner') return <div>Not authorized.</div>
  if (storesLoading) return <div>Loading stores...</div>
  if (storesError || !stores) return <div>Failed to load stores.</div>
  if (!myStore) return <div>No store found for your account.</div>
  if (isLoading) return <div>Loading...</div>
  if (isError || !store)
    return <div>Failed to load store or store not found.</div>
  if (!store?.products || store?.products.length === 0)
    return <div>No products found for your store.</div>



 
  // Now fetch the full store details (including products)
  // Use the store_id from the user object
//   const {
//     data: store,
//     isLoading,
//     isError,
//   } = useStore(user.id) as {
//     data: { products: TProduct[] } | undefined
//     isLoading: boolean
//     isError: boolean
//   }
  return (
    <div className="grid grid-cols-4 gap-6">
      {store.products.map((product: TProduct) => {
        //   const avgRating = product.size || 0 // adjust if you have ratings
        return (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition border border-gray-100 group relative"
          >
            <img
              src={product.product_image}
              alt={product.product_name}
              className="w-full h-40 object-contain rounded-t-xl bg-green-50"
            />
            <div className="p-4">
              <h2 className="font-semibold text-lg text-green-700 group-hover:text-orange-500 transition">
                {product.product_name}
              </h2>
              <p className="text-sm text-gray-500 mb-2 truncate">
                {product.product_description}
              </p>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition mr-2"
                onClick={() => setSelectedProduct(product)}
              >
                View
              </button>
              {/* Price and cart button */}
              <button
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition"
                // onClick={() => handleAddToCart(product)} // optional for store owner
              >
                <ShoppingCart size={18} />
              </button>
            </div>
            {/* Out of stock badge */}
            {!product.is_available && (
              <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>
        )
      })}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
