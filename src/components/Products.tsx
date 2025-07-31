import React, { useState } from 'react'
import { useProduct } from '@/hooks/UseProduct'
import ProductDetails from './ProductDetails'
import { useParams } from '@tanstack/react-router'
import { useCategory } from '@/hooks/useCategory'
import GroceryLoader from './ui/GroceryLoader'
import { motion, AnimatePresence } from 'framer-motion'
import type { TCategory } from '@/types/category.types'

type TProduct = {
  id: number
  product_name: string
  product_description: string
  product_price: number
  product_image: string | null
  category_id?: string
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: { opacity: 0, scale: 0.8 },
}

const hoverEffect = {
  scale: 1.03,
  transition: { duration: 0.3 },
}

const tapEffect = {
  scale: 0.98,
}

const Products: React.FC = () => {
  const { categoryId } = useParams({ from: '/product/$categoryId' })

  const {
    data: products,
    isLoading,
    error,
  } = useProduct() as {
    data: TProduct[]
    isLoading: boolean
    error: unknown
  }

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { data: category } = useCategory(categoryId) as {
    data: TCategory
    isLoading: boolean
    error: unknown
  }

  const handleProductClick = (id: number) => {
    setSelectedId(id.toString())
  }

  if (isLoading)
    return (
      <div className="p-4 text-center">
        <GroceryLoader />
      </div>
    )

  if (error || !products)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 text-center text-red-500"
      >
        Failed to load products.
      </motion.div>
    )

  return (
    <motion.div
      className="max-w-6xl mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {category?.category_name || 'Products'}
      </motion.h1>

      <AnimatePresence mode="wait">
        {selectedId ? (
          <motion.div
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductDetails
              productId={selectedId}
              onBack={() => setSelectedId(null)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(category?.products ?? []).map((product: TProduct) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={hoverEffect}
                  whileTap={tapEffect}
                  onClick={() => handleProductClick(product.id)}
                  className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition duration-200"
                  layoutId={`product-${product.id}`}
                >
                  <motion.img
                    src={
                      product.product_image ??
                      'https://gardenfishcorner.pk/wp-content/uploads/2021/02/king-fish-2-768x979.jpg'
                    }
                    alt={product.product_name}
                    className="w-full h-60 object-cover mb-3 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                  />
                  <h4 className="font-semibold text-lg">
                    {product.product_name}
                  </h4>
                  <p className="text-red-600 font-bold">
                    Ksh {product.product_price}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              className="mt-6 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mx-auto block"
              whileHover={{ scale: 1.05 }}
              whileTap={tapEffect}
            >
              Show More
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Products
