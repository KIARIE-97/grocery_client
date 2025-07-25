import { useStore } from '@/hooks/useStore'
import { useCart } from '@/store/cartStore'
import type { TProduct } from '@/types/product.types'
import {
  ShoppingCart,
  Heart,
  Star,
  StarOff,
  Plus,
  Minus,
  ChevronDown,
} from 'lucide-react'
import Navbar from './navbar'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import GroceryLoader from './ui/GroceryLoader'

type StoreProductsProps = {
  storeId: string
  onClose?: () => void
}

function StoreDetails({ storeId, onClose }: StoreProductsProps) {
  const {
    data: store,
    isLoading,
    isError,
  } = useStore(storeId) as {
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
  const { dispatch, state: cartState } = useCart()
  const [showAllProducts, setShowAllProducts] = useState(false)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})

  const getAverageRating = (product: TProduct) => {
    if (!product.ratings || product.ratings.length === 0) return 0
    const sum = product.ratings.reduce((acc, rating: { value: number }) => acc + rating.value, 0)
    return Math.round(sum / product.ratings.length)
  }

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

  const handleQuantityChange = (product: TProduct, change: number) => {
    const cartItem = cartState.items.find((item) => item.id === product.id)
    const newQuantity = (cartItem?.quantity || 0) + change

    if (newQuantity <= 0) {
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: product.id,
      })
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: {
          id: product.id,
          quantity: newQuantity,
        },
      })
    }
  }

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="center py-12"
      >
        <GroceryLoader />
      </motion.div>
    )
  }
  if (isError || !store) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-red-500"
      >
        Failed to load store or store not found.
      </motion.div>
    )
  }

  const displayedProducts = showAllProducts
    ? store.products
    : (store.products || []).slice(0, 6)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-white rounded-lg p-4"
    >
      <Navbar />
      {/* Store info */}
      <motion.div
        className="mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div
          className="relative w-full h-50 md:h-60 rounded-lg overflow-hidden flex items-center justify-center"
          style={{
            backgroundImage: `url(${store?.shop_image || '/default-store-image.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/30 bg-opacity-40" />
          <h2 className="relative z-10 text-3xl md:text-4xl font-bold text-gray-300 text-center">
            {store?.store_name}
          </h2>
          <span className="text-gray-300">lets shop </span>
        </div>
      </motion.div>

      {/* Products grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {displayedProducts && displayedProducts.length > 0 ? (
          displayedProducts.map((product: TProduct) => {
            const avgRating = getAverageRating(product)
            const cartItem = cartState.items.find(
              (item) => item.id === product.id,
            )
            const isFavorite = favorites[product.id] || false

            return (
              <motion.div
                key={product.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition border border-gray-100 group relative"
                whileHover={{ y: -5 }}
                layout
              >
                {/* Favorite icon */}
                <motion.div
                  className="absolute right-3 top-3 z-10"
                  whileTap={{ scale: 1.2 }}
                >
                  <button
                    onClick={() => toggleFavorite(String(product?.id))}
                    className={`${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'} hover:text-red-500 transition`}
                  >
                    <Heart size={20} />
                  </button>
                </motion.div>

                {/* Product image */}
                <motion.img
                  src={product.product_image}
                  alt={product.product_name}
                  className="w-full h-40 object-contain rounded-t-xl bg-green-50"
                  whileHover={{ scale: 1.05 }}
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
                  <div className="flex items-center mb-2 text-yellow-400 gap-0.5 overflow-hidden max-w-full">
                    {Array.from({ length: 5 }).map((_, i) =>
                      i < avgRating ? (
                        <Star
                          key={i}
                          size={14}
                          strokeWidth={2}
                          className="fill-yellow-400"
                        />
                      ) : (
                        <StarOff key={i} size={14} strokeWidth={2} />
                      ),
                    )}
                    {/* <span className="text-xs text-gray-500 ml-1">
                      ({product.ratings?.length || 0})
                    </span> */}
                  </div>

                  {/* Price and cart button */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-700">
                      KES{product.product_price}
                    </span>

                    <AnimatePresence mode="wait">
                      {cartItem ? (
                        <motion.div
                          className="flex items-center gap-2 bg-green-500 text-white rounded-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={`controls-${product.id}`}
                        >
                          <button
                            onClick={() => handleQuantityChange(product, -1)}
                            className="p-1 hover:bg-green-600 rounded-l-full transition"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-sm">{cartItem.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(product, 1)}
                            className="p-1 hover:bg-green-600 rounded-r-full transition"
                          >
                            <Plus size={16} />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.button
                          onClick={() => handleAddToCart(product)}
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={`add-${product.id}`}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ShoppingCart size={18} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Out of stock badge */}
                {!product.is_available && (
                  <motion.span
                    className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-2 py-1 rounded"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    Out of Stock
                  </motion.span>
                )}
              </motion.div>
            )
          })
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No products found for this store.
          </div>
        )}
      </motion.div>

      {/* Show All button */}
      {store.products && store.products.length > 6 && (
        <motion.div
          className="flex justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setShowAllProducts(!showAllProducts)}
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition"
          >
            {showAllProducts ? 'Show Less' : 'Show All'}
            <motion.span
              animate={{ rotate: showAllProducts ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={18} />
            </motion.span>
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default StoreDetails
