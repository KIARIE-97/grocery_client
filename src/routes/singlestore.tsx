import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useStore } from '@/hooks/useStore'
import { useCart } from '@/store/cartStore'
import type { TProduct } from '@/types/product.types'
import { ShoppingCart, Heart, Star, StarOff } from 'lucide-react'
import { z } from 'zod'
import Footer from '@/components/bars/Footer'

export const Route = createFileRoute('/singlestore')({
  validateSearch: z.object({
    id: z.coerce.number(),
  }),
  component: RouteComponent,
})

type StoreProductsProps = {
  id: string
  onClose?: () => void
}

function RouteComponent({ search }: { search: { Id: string } }) {
  const { state } = useRouter()
  console.log('router search state:', state.location.search)
   const id = search?.Id 

 console.log('Store ID from search:', id)
   const { data: store, isLoading, isError } = useStore(id) as {
    data: {
      store_name: string
      user?: { full_name?: string }
      location?: string
      description?: string
      products?: TProduct[]
    }
    isLoading: boolean
    isError: boolean
  }
  console.log('Store data:', store)
  const { dispatch } = useCart()

  
  const getAverageRating = (product: TProduct) => 4

  const handleAddToCart = (product: TProduct) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        product_name: product.product_name,
        product_price: product.product_price,
        product_image: product.product_image,
        size: product.size,
        quantity: product.quantity,
      },
    })
  }

    if (!id) {
        return <div className="text-center py-12 text-red-500">No store selected.</div>
    }

  if (isLoading) {
    return <div className="text-center py-12">Loading store...</div>
  }
  if (isError || !store) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load store or store not found.
      </div>
    )
  }

  return (
    // <div
    //   className="w-full min-h-screen bg-cover bg-center flex flex-col items-center"
    //   style={{
    //     backgroundImage: `url(${bgImage})`,
    //   }}
    // >
    <div className="w-full max-w-4xl mx-auto bg-white bg-opacity-90 rounded-lg shadow p-6 mt-8">
      {/* Welcome Title */}
      <h1 className="text-3xl font-bold text-orange-600 text-center mb-4">
        Welcome to {store.store_name}
      </h1>
      {/* Store info */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <div className="text-gray-600 text-sm">
            Owned by{' '}
            <span className="font-semibold">{store.user?.full_name}</span>
          </div>
          <div className="text-gray-500 text-xs">{store.location}</div>
        </div>
      </div>
      {/* Store description */}
      <div className="mb-4 text-gray-700">{store.description}</div>
      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {store.products && store.products.length > 0 ? (
          store.products.map((product: TProduct) => {
            const avgRating = getAverageRating(product)
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition border border-gray-100 group relative"
              >
                {/* Favorite icon */}
                <div className="absolute right-3 top-3 z-10">
                  <button className="text-gray-400 hover:text-red-500 transition">
                    <Heart size={20} />
                  </button>
                </div>
                {/* Product image */}
                <img
                  src={product.product_image}
                  alt={product.product_name}
                  className="w-full h-40 object-contain rounded-t-xl bg-green-50"
                />
                {/* Product info */}
                <div className="p-4">
                  <h2 className="font-semibold text-lg text-green-700 group-hover:text-orange-500 transition">
                    {product.product_name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-2 truncate">
                    {product.product_description}
                  </p>
                  {/* Rating */}
                  <div
                    className="flex items-center mb-2 text-yellow-400 gap-0.5 overflow-hidden max-w-full"
                    style={{ fontSize: 0 }}
                  >
                    {Array.from({ length: 5 }).map((_, i) =>
                      i < avgRating ? (
                        <Star key={i} size={14} strokeWidth={2} />
                      ) : (
                        <StarOff key={i} size={14} strokeWidth={2} />
                      ),
                    )}
                  </div>
                  {/* Price and cart button */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-700">
                      KES{product.product_price}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
                {/* Out of stock badge */}
                {!product.is_available && (
                  <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    Out of Stock
                  </span>
                )}
              </div>
            )
          })
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No products found for this store.
          </div>
        )}
      </div>
      <Footer />
    </div>
    // </div>
  )
}