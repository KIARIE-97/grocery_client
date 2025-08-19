// Enhanced SidebarFilter component
import React, { useState, useEffect } from 'react'
import { FilterX } from 'lucide-react'
import type { UseQueryResult } from '@tanstack/react-query'
import { useCategories } from '@/hooks/useCategory'
import { motion } from 'framer-motion'

interface TCategory {
  id: number
  category_name: string
}

interface SidebarFilterProps {
  onFilterChange?: (filters: {
    category?: string
    priceRange?: [number, number]
    rating?: number
    tags?: string[]
  }) => void
}

const tags = [
  'Fresh',
  'Local',
  'New',
  'Discount',
  'Popular',
  'Organic',
  'Seasonal',
]

const SidebarFilter: React.FC<SidebarFilterProps> = ({ onFilterChange }) => {
  const {
    data: categoriesData,
    isLoading,
    isError,
  } = useCategories() as UseQueryResult<TCategory[], unknown>
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [rating, setRating] = useState<number>(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setPriceRange([0, 100])
    setRating(0)
    setSelectedTags([])
  }

  useEffect(() => {
    onFilterChange?.({
      category: selectedCategory ?? undefined,
      priceRange,
      rating: rating > 0 ? rating : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    })
  }, [selectedCategory, priceRange, rating, selectedTags, onFilterChange])

  const filterItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        type: "spring" as "spring",
        stiffness: 100,
      },
    }),
  }

  return (
    <motion.aside
      className="w-full p-6 bg-white rounded-xl shadow-lg border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-green-700 flex items-center gap-2">
          <FilterX className="text-orange-500" />
          Filters
        </h2>
        <button
          onClick={clearFilters}
          className="text-sm text-orange-500 hover:text-orange-700 underline"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <motion.section className="mb-8">
        <motion.h3
          className="text-orange-600 font-semibold mb-4 text-lg flex items-center gap-2"
          whileHover={{ x: 5 }}
        >
          Categories
        </motion.h3>
        {isLoading && <p className="text-green-700">Loading categories...</p>}
        {isError && <p className="text-red-600">Failed to load categories.</p>}
        {!isLoading && !isError && (
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {categoriesData?.map((category, i) => (
              <motion.li
                key={category.id}
                variants={filterItemVariants}
                initial="hidden"
                animate="visible"
                custom={i}
              >
                <button
                  className={`w-full text-left py-2 px-3 rounded-lg transition ${
                    selectedCategory === category.category_name
                      ? 'bg-orange-100 text-orange-600 font-medium'
                      : 'text-gray-700 hover:bg-green-50'
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category.category_name
                        ? null
                        : category.category_name,
                    )
                  }
                >
                  {category.category_name}
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.section>

      {/* Price Range */}
      <motion.section className="mb-8">
        <motion.h3
          className="text-orange-600 font-semibold mb-4 text-lg flex items-center gap-2"
          whileHover={{ x: 5 }}
        >
          Price Range
        </motion.h3>
        <div className="px-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">KES0</span>
            <span className="text-sm font-medium text-green-700">
              KES{priceRange[1].toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">KES100+</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>
      </motion.section>

      {/* Tags */}
      <motion.section>
        <motion.h3
          className="text-orange-600 font-semibold mb-4 text-lg flex items-center gap-2"
          whileHover={{ x: 5 }}
        >
          Popular Tags
        </motion.h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => {
            const selected = selectedTags.includes(tag)
            return (
              <motion.button
                key={tag}
                variants={filterItemVariants}
                initial="hidden"
                animate="visible"
                custom={i}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  selected
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.button>
            )
          })}
        </div>
      </motion.section>
    </motion.aside>
  )
}

export default SidebarFilter
