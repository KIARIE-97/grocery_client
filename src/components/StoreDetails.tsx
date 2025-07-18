import { useStore } from '@/hooks/useStore'
import { useCart } from '@/store/cartStore'
import type { TProduct } from '@/types/product.types'
import { ShoppingCart, Heart, Star, StarOff } from 'lucide-react'
import Navbar from './navbar'

type StoreProductsProps = {
  storeId: string
  onClose?: () => void
}
function StoreDetails({ storeId, onClose }: StoreProductsProps) {
   const { data: store, isLoading, isError } = useStore(storeId) as {
    data: {
      store_name: string
      shop_image?: string
      user?: { full_name?: string }
      location?: string
      description?: string
      products?: TProduct[]
    }
    isLoading: boolean
    isError: boolean
  }
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
        quantity: 1,
      },
    })
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
    // <div className="w-full h-full max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
    <div className="w-full min-h-screen bg-white rounded-lg  p-4">
      <Navbar />
      {/* Store info */}
      <div className="mb-6">
        {/* Store image as background with overlayed name */}
        <div
          className="relative w-full h-50 md:h-60 rounded-lg overflow-hidden flex items-center justify-center"
          style={{
            backgroundImage: `url(${store?.shop_image || '/default-store-image.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/30  bg-opacity-40" />
          <h2 className="relative z-10 text-3xl md:text-4xl font-bold text-gray-300 text-center">
            {store?.store_name}
          </h2>
          <span className="text-gray-300">lets shop </span>
        </div>
      </div>
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
    </div>
  )
}

export default StoreDetails