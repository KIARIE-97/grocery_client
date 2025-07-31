// Enhanced ProductGrid component
import React, { useMemo, useState } from 'react'
import { Heart, ShoppingCart, Star, StarOff, Store } from 'lucide-react'
import { useProduct } from '@/hooks/UseProduct'
import type { TProduct } from '@/types/product.types'
import { useCart } from '@/store/cartStore'
import { motion, AnimatePresence } from 'framer-motion'
import StoreDetails from './StoreDetails'
import { useNavigate } from '@tanstack/react-router'

interface ProductGridProps {
  filters?: {
    category?: string
    priceRange?: [number, number]
    rating?: number
    tags?: string[]
  }
}

const ProductGrid: React.FC<ProductGridProps> = ({ filters }) => {
  const { data, isLoading, isError } = useProduct()
  const products: TProduct[] = Array.isArray(data) ? data : []
  const { dispatch } = useCart()
  const [showProducts, setShowProducts] = useState(false)
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const navigate = useNavigate()

  const getAverageRating = (product: TProduct) => {
    if (!product.ratings || product.ratings.length === 0) return 0
    const sum = product.ratings.reduce(
      (acc, rating: { value: number }) => acc + rating.value,
      0,
    )
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

  const filteredProducts = useMemo(() => {
    if (!products) return []
    return products.filter((product) => {
      if (filters?.category) {
        const hasCategory = product.categories?.some(
          (cat) =>
            cat.category_name.toLowerCase() === filters.category?.toLowerCase(),
        )
        if (!hasCategory) return false
      }
      if (filters?.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange
        if (
          product.product_price < minPrice ||
          product.product_price > maxPrice
        ) {
          return false
        }
      }
      return true
    })
  }, [products, filters])

  if (isLoading)
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-xl shadow-md h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          />
        ))}
      </div>
    )

  if (isError)
    return (
      <motion.div
        className="text-center py-12 text-red-500"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        Failed to load products.
      </motion.div>
    )

  if (!products || filteredProducts.length === 0)
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-gray-500 mb-4">No products match your filters</div>
        <motion.button
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate({ to: '/featuredproducts' })}
        >
          Reset Filters
        </motion.button>
      </motion.div>
    )

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, i) => {
          const avgRating = getAverageRating(product)
          const isHovered = hoveredProduct === String(product.id)

          return (
            <motion.div
              key={product.id}
              className="bg-white relative rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: 'spring' }}
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredProduct(String(product.id))}
              onHoverEnd={() => setHoveredProduct(null)}
              layout
            >
              {/* Favorite button */}
              <motion.button
                className="absolute right-3 z-10 p-2 bg-white/80 rounded-full backdrop-blur-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart
                  size={20}
                  className="text-gray-400 hover:text-red-500 transition"
                  fill="none"
                />
              </motion.button>

              {/* Product image with bounce effect */}
              <motion.div
                className="h-48 w-full bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <motion.img
                  src={product.product_image}
                  alt={product.product_name}
                  className="h-full object-contain transition duration-300"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                    rotate: isHovered ? [0, 5, -5, 0] : 0,
                  }}
                  transition={{
                    scale: { duration: 0.3 },
                    rotate: { duration: 0.5 },
                  }}
                />
                {!product.is_available && (
                  <motion.div
                    className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    Out of Stock
                  </motion.div>
                )}
              </motion.div>

              {/* Product info */}
              <div className="p-4">
                <h2 className="font-semibold text-gray-800 group-hover:text-orange-500 transition line-clamp-2 mb-1">
                  {product.product_name}
                </h2>

                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {product.product_description}
                </p>

                {/* Rating with animation */}
                <motion.div className="flex items-center mb-3">
                  <div className="flex text-yellow-400 gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.span
                        key={star}
                        animate={{
                          scale:
                            isHovered && star <= avgRating ? [1, 1.2, 1] : 1,
                          y: isHovered && star <= avgRating ? [0, -3, 0] : 0,
                        }}
                        transition={{ delay: star * 0.05 }}
                      >
                        {star <= avgRating ? (
                          <Star size={16} className="fill-current" />
                        ) : (
                          <StarOff size={16} className="text-gray-300" />
                        )}
                      </motion.span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">
                    ({product.ratings?.length || 0})
                  </span>
                </motion.div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-orange-500">
                      KES{product.product_price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedStoreId(product.store?.id ?? null)
                        setShowProducts(true)
                      }}
                    >
                      <Store size={18} />
                    </motion.button>

                    <motion.button
                      className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.is_available}
                    >
                      <ShoppingCart size={18} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Store products modal */}
      <AnimatePresence>
        {showProducts && selectedStoreId && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] relative overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <button
                className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                onClick={() => {
                  setShowProducts(false)
                  setSelectedStoreId(null)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <StoreDetails
                storeId={selectedStoreId}
                onClose={() => {
                  setShowProducts(false)
                  setSelectedStoreId(null)
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProductGrid
