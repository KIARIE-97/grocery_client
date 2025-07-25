import SidebarFilter from '@/components/bars/filter'
import Footer from '@/components/bars/Footer'
import ProductGrid from '@/components/FilterGrid'
import Navbar from '@/components/navbar'
import GroceryLoader from '@/components/ui/GroceryLoader'
import { useProduct } from '@/hooks/UseProduct'
import type { TProduct } from '@/types/product.types'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

// Route definition
export const Route = createFileRoute('/featuredproducts')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, isError } = useProduct()
  const [filters, setFilters] = useState<{
    category?: string
    priceRange?: [number, number]
    rating?: number
    tags?: string[]
  }>({})

  if (isLoading) return <div className="center py-12">
    <GroceryLoader />
  </div>
  if (isError)
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load products.
      </div>
    )

  return (
    <>
        <Navbar />
      <div className="bg-white min-h-screen p-10">
        <h1 className="text-3xl font-bold text-green-700 mb-8">
          Featured Products
        </h1>

        {/* Main layout: sidebar + products side by side */}
        <div className="flex gap-10">
          {/* Sidebar fixed width */}
          <div className="w-64">
            <SidebarFilter onFilterChange={setFilters} />
          </div>

          {/* Product grid grows to fill remaining space */}
          <div className="flex-1">
            {/* Pass filters to ProductGrid */}
            <ProductGrid filters={filters} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
