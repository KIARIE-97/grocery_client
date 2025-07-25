import React, { useState, useEffect } from 'react'

import { Star } from 'lucide-react'
import type { UseQueryResult } from '@tanstack/react-query'
import { useCategories } from '@/hooks/useCategory'

interface TCategory {
  id: number
  category_name: string
  // add other category fields if any
}

interface SidebarFilterProps {
  onFilterChange?: (filters: {
    category?: string
    priceRange?: [number, number]
    rating?: number
    tags?: string[]
  }) => void
}

const tags = ['Fresh', 'Local', 'New', 'Discount', 'Popular']

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

  useEffect(() => {
    onFilterChange?.({
      category: selectedCategory ?? undefined,
      priceRange,
      rating: rating > 0 ? rating : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    })
  }, [selectedCategory, priceRange, rating, selectedTags, onFilterChange])
                

  return (
    <aside className="w-64 p-6 bg-primaryLightGreen rounded-lg shadow-md">
      {/* Categories */}
      <section className="mb-8">
        <h3 className="text-orange-600 font-semibold mb-3 text-lg">
          All Categories
        </h3>
        {isLoading && <p className="text-green-700">Loading categories...</p>}
        {isError && <p className="text-red-600">Failed to load categories.</p>}
        {!isLoading && !isError && (
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {/* <pre>{JSON.stringify(categoriesData, null, 2)}</pre> */}
            {categoriesData?.map((category) => (
              <li key={category.id}>
                <button
                  className={`text-green-700 hover:text-orange-600 transition w-full text-left ${
                    selectedCategory === category.category_name
                      ? 'font-bold underline'
                      : ''
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
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Price Range */}
      <section className="mb-8">
        <h3 className="text-orange-600 font-semibold mb-3 text-lg">
          Filter by Price
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="accent-green-500 w-full"
          />
          <span className="text-green-700 font-semibold">${priceRange[1]}</span>
        </div>
        <div className="flex justify-between text-sm text-green-700 mt-1">
          <span>KES0</span>
          <span>KES100</span>
        </div>
      </section>

      {/* Rating */}
      {/* <section className="mb-8">
        <h3 className="text-orange-600 font-semibold mb-3 text-lg">Rating</h3>
        <div className="flex space-x-1">
          {[5, 4, 3, 2, 1].map((starCount) => (
            <button
              key={starCount}
              onClick={() => setRating(starCount === rating ? 0 : starCount)}
              className={`flex items-center gap-1 px-3 py-1 rounded cursor-pointer transition ${
                rating === starCount
                  ? 'bg-orange-500 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-300'
              }`}
              aria-label={`${starCount} star${starCount > 1 ? 's' : ''} & up`}
            >
              {Array.from({ length: starCount }).map((_, i) => (
                <Star key={i} size={16} />
              ))}
              <span className="text-sm">{starCount}+</span>
            </button>
          ))}
        </div>
      </section> */}

      {/* Tags */}
      <section>
        <h3 className="text-orange-600 font-semibold mb-3 text-lg">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const selected = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  selected
                    ? 'bg-orange-500 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-300'
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </section>
    </aside>
  )
}

export default SidebarFilter
