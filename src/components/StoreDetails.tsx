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
  MapPin,
  Clock,
  Phone,
  Info,
} from 'lucide-react'
import Navbar from './navbar'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import GroceryLoader from './ui/GroceryLoader'
import Footer from './bars/Footer'

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
      opening_time?: string
      closing_time?: string
      contact?: string
    }
    isLoading: boolean
    isError: boolean
  }

  const { dispatch, state: cartState } = useCart()
  const [showAllProducts, setShowAllProducts] = useState(false)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})
  const [activeCategory, setActiveCategory] = useState<string>('all')

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

  // Extract unique categories from products
  const categories = [
    'all',
    ...Array.from(
      new Set(
        (store?.products || []).flatMap((p) =>
          Array.isArray(p.categories)
            ? p.categories.map((cat: any) => cat?.category_name).filter(Boolean)
            : [],
        ),
      ),
    ),
  ]
console.log('store products', store?.products)
console.log('store categories', categories)

  const filteredProducts =
    activeCategory === 'all'
      ? store?.products
      : store?.products?.filter(
          (p) =>
            Array.isArray(p.categories) &&
            p.categories.some(
              (cat: any) =>
                typeof cat === 'object' &&
                'category_name' in cat &&
                cat.category_name === activeCategory,
            ),
        )

  const displayedProducts = showAllProducts
    ? filteredProducts
    : filteredProducts?.slice(0, 12)

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Store Hero Section */}
      <motion.div
        className="relative w-full h-64 md:h-80 lg:h-96"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
        <img
          src={store?.shop_image || '/default-store-image.jpg'}
          alt={store?.store_name}
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-0 left-0 z-20 p-6 w-full">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {store?.store_name}
          </motion.h1>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center text-white">
              <MapPin className="w-5 h-5 mr-1" />
              <span>{store?.location || 'N/A'}</span>
            </div>

            <div className="flex items-center text-white">
              <Clock className="w-5 h-5 mr-1" />
              <span>
                {store?.opening_time || 'N/A'} - {store?.closing_time || 'N/A'}
              </span>
            </div>

            {store?.contact && (
              <div className="flex items-center text-white">
                <Phone className="w-5 h-5 mr-1" />
                <span>{store.contact}</span>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Store Info Section */}
      <motion.section
        className="bg-white py-8 px-4 shadow-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="container mx-auto">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                About {store?.store_name}
              </h2>
              <p className="text-gray-600">
                {store?.description || 'No description available.'}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Products Section */}
      <section className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          {/* Categories Filter */}
          <motion.div
            className="mb-8 overflow-x-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex space-x-2 pb-2">
              {categories.map((category) => (
                <button
                  key={typeof category === 'string' ? category : JSON.stringify(category)}
                  onClick={() => setActiveCategory(typeof category === 'string' ? category : '')}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    activeCategory === (typeof category === 'string' ? category : '')
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {typeof category === 'string'
                    ? category.charAt(0).toUpperCase() + category.slice(1)
                    : JSON.stringify(category)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
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
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 group relative overflow-hidden"
                    whileHover={{ y: -5 }}
                    layout
                  >
                    {/* Favorite and Badges */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
                      <motion.button
                        onClick={() => toggleFavorite(String(product?.id))}
                        className={`p-2 rounded-full ${isFavorite ? 'text-red-500 bg-white shadow-md' : 'text-gray-400 bg-white/80'} hover:text-red-500 transition`}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart
                          size={18}
                          fill={isFavorite ? 'currentColor' : 'none'}
                        />
                      </motion.button>

                      {!product.is_available && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Product Image */}
                    <div className="h-48 w-full bg-gray-100 flex items-center justify-center p-4">
                      <motion.img
                        src={product.product_image}
                        alt={product.product_name}
                        className="h-full object-contain transition duration-300 group-hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h2 className="font-semibold text-lg text-gray-800 group-hover:text-orange-500 transition line-clamp-2">
                        {product.product_name}
                      </h2>

                      {product.categories && (
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mb-2">
                          {Array.isArray(product.categories) && product.categories.length > 0
                            ? product.categories[0]?.category_name
                            : ''}
                        </span>
                      )}

                      {product.product_description && (
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                          {product.product_description}
                        </p>
                      )}

                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400 gap-0.5">
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
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          ({product.ratings?.length || 0})
                        </span>
                      </div>

                      {/* Price and Cart Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <span className="font-bold text-orange-500 text-lg">
                            KES {product.product_price.toLocaleString()}
                          </span>
                          {product.product_price && (
                            <span className="text-xs text-gray-400 line-through ml-2">
                              KES {product.product_price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <AnimatePresence mode="wait">
                          {cartItem ? (
                            <motion.div
                              className="flex items-center gap-2 bg-orange-500 text-white rounded-full px-3 py-1"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              key={`controls-${product.id}`}
                            >
                              <button
                                onClick={() =>
                                  handleQuantityChange(product, -1)
                                }
                                className="hover:bg-orange-600 rounded-full transition"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="text-sm font-medium">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(product, 1)}
                                className="hover:bg-orange-600 rounded-full transition"
                              >
                                <Plus size={16} />
                              </button>
                            </motion.div>
                          ) : (
                            <motion.button
                              onClick={() => handleAddToCart(product)}
                              className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition shadow-md"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              key={`add-${product.id}`}
                              whileTap={{ scale: 0.9 }}
                              disabled={!product.is_available}
                            >
                              <ShoppingCart size={18} />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 mb-4">
                  No products found in this category
                </div>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full"
                >
                  View All Products
                </button>
              </div>
            )}
          </motion.div>

          {/* Show More/Less Button */}
          {filteredProducts && filteredProducts.length > 12 && (
            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <button
                onClick={() => setShowAllProducts(!showAllProducts)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full transition shadow-lg"
              >
                {showAllProducts ? 'Show Less' : 'Show More'}
                <motion.span
                  animate={{ rotate: showAllProducts ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} />
                </motion.span>
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default StoreDetails
