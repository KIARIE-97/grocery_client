// Enhanced FeaturedProducts component (parent)
import { motion } from 'framer-motion'
import SidebarFilter from '@/components/bars/filter'
import Footer from '@/components/bars/Footer'
import ProductGrid from '@/components/FilterGrid'
import Navbar from '@/components/navbar'
import GroceryLoader from '@/components/ui/GroceryLoader'
import { useProduct } from '@/hooks/UseProduct'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/featuredproducts')({
  component: RouteComponent,
})

function RouteComponent() {
  const {  isLoading, isError } = useProduct()
  const [filters, setFilters] = useState<{
    category?: string
    priceRange?: [number, number]
    rating?: number
    tags?: string[]
  }>({})

  if (isLoading)
    return (
      <motion.div
        className="center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <GroceryLoader />
      </motion.div>
    )

  if (isError)
    return (
      <motion.div
        className="text-center py-12 text-red-500"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        Failed to load products.
      </motion.div>
    )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <motion.main
        className="flex-1 p-6 md:p-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl font-bold text-green-700 mb-8 text-center md:text-left"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Featured Products
          <motion.span
            className="inline-block ml-2 text-orange-500"
            animate={{
              y: [0, -5, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 2,
            }}
          >
            🎯
          </motion.span>
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside
            className="w-full lg:w-64"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <SidebarFilter onFilterChange={setFilters} />
          </motion.aside>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <ProductGrid filters={filters} />
          </motion.div>
        </div>
      </motion.main>

      <Footer />
    </div>
  )
}
