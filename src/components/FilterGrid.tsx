import React, { useMemo, useState } from 'react'
import { Heart, ShoppingCart, Star, StarOff, Store } from 'lucide-react'
import { useProduct } from '@/hooks/UseProduct'
import type { TProduct } from '@/types/product.types'
import { useCart } from '@/store/cartStore'
import { useNavigate } from '@tanstack/react-router'
import StoreDetails from './StoreDetails'

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
  
    const navigate = useNavigate() 

  // Helper: average rating placeholder (replace with real data if available)
  const getAverageRating = (products: TProduct) => {
    // For demo, random rating 1-5 or fixed
    return 4 // or Math.floor(Math.random() * 5) + 1
  }
  const handleAddToCart = (product: TProduct) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        product_name: product.product_name,
        product_price: product.product_price,
        product_image: product.product_image,
        size: product.size, // Make sure 'size' exists on TProduct or adjust accordingly
        quantity: 1,
      },
    })

    console.log('Added to cart:', product.product_name)
  }

  // Filter products client-side based on filters
  const filteredProducts = useMemo(() => {
    if (!products) return []

    return products.filter((product) => {
      // Filter by category (assuming product.categorys is array of categories with name)
      if (filters?.category) {
        const hasCategory = product.categories.some(
          (cat) => cat.category_name.toLowerCase() === filters.category?.toLowerCase(),
        )
        if (!hasCategory) return false
      }

      // Filter by price range
      if (filters?.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange
        if (
          product.product_price < minPrice ||
          product.product_price > maxPrice
        ) {
          return false
        }
      }

      // Filter by rating
      if (filters?.rating) {
        const avgRating = getAverageRating(product)
        if (avgRating < filters.rating) return false
      }

      // Filter by tags (if you have tags on product, otherwise skip)
      if (filters?.tags && filters.tags.length > 0) {
        // Assuming product.tags is string[]; adjust if different
        // If no tags on product, skip filtering by tags or implement your own logic
        // For demo, skip filtering by tags
      }

      return true
    })
  }, [products, filters])

  if (isLoading)
    return <div className="text-center py-12">Loading products...</div>
  if (isError)
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load products.
      </div>
    )
  if (!products || filteredProducts.length === 0)
    return (
      <div className="text-center py-12 text-gray-500">No products found.</div>
    )
    

  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
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
                <button
                  onClick={() => {
                    setSelectedStoreId(product.store?.id ?? null)
                    console.log('product.store:', product.store)
                    console.log('Selected Store ID:', product.store?.id)
                    setShowProducts(true)
                  }}
                  className="bg-orange-400 hover:bg-orange-600 text-white p-2 rounded-full transition"
                >
                  <Store />
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
      </div>
      {/* Modal for store products */}
      {showProducts && selectedStoreId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 w-full h-full">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[98vw] h-[96vh] relative overflow-auto">
            <button
              className="absolute top-2 right-2 text-orange-600 hover:text-orange-800 text-2xl"
              onClick={() => {
                setShowProducts(false)
                setSelectedStoreId(null)
              }}
            >
              &times;
            </button>
            <StoreDetails
              storeId={selectedStoreId}
              onClose={() => {
                setShowProducts(false)
                setSelectedStoreId(null)
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ProductGrid
