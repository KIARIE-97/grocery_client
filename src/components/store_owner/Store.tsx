import React, { useState } from 'react'
import type { TStore } from '@/types/store.types'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Star, MapPin, ShoppingBag, ChevronDown } from 'lucide-react'
import StoreDetails from '../StoreDetails'

type StoreCardProps = {
  store: TStore
  orders: any[]
}

export const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const [showProducts, setShowProducts] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const storeImage =
    store.shop_image ||
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1470&auto=format&fit=crop'

  const borderColor =
    store.status === 'active'
      ? 'border-t-4 border-green-500'
      : 'border-t-4 border-red-500'

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    hover: {
      y: -5,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3 },
    },
  }

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }

  return (
    <>
      <motion.div
        className={`bg-white ${borderColor} shadow-md rounded-xl overflow-hidden flex flex-col w-full h-full`}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Store image with overlay effect */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={storeImage}
            alt={store.store_name}
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Status badge */}
          <div
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
              store.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {store.status === 'active' ? 'Open' : 'Closed'}
          </div>
        </div>

        {/* Store content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Store name and rating */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-800">
              {store.store_name}
            </h3>
            <div className="flex items-center bg-orange-50 px-2 py-1 rounded">
              <Star className="w-4 h-4 text-orange-400 fill-current" />
              <span className="ml-1 text-sm font-medium">4.8</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{store.location || 'N/A'}</span>
          </div>

          {/* Hours */}
          <div className="flex items-center text-gray-600 mb-4">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {store.opening_time} - {store.closing_time}
            </span>
          </div>

          {/* Description with read more */}
          <div className="mb-4 text-gray-600 text-sm flex-1">
            <p className="line-clamp-3">
              {store.description || 'No description provided.'}
            </p>
          </div>

          {/* Shop button */}
          <motion.button
            className="mt-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowProducts(true)}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Shop Now</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Modal for store products */}
      <AnimatePresence>
        {showProducts && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-[95vw] h-[90vh] max-w-6xl relative overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <button
                className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                onClick={() => setShowProducts(false)}
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

              <div className="h-full overflow-y-auto">
                <StoreDetails
                  storeId={store.id ?? ''}
                  onClose={() => setShowProducts(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default StoreCard
