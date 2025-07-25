import React, { useState } from 'react'
import type { TStore } from '@/types/store.types'
import { Link } from '@tanstack/react-router'
import StoreDetails from '../StoreDetails'

type StoreCardProps = {
  store: TStore
  orders: any[]
}

export const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const [showProducts, setShowProducts] = useState(false)
  const storeImage =
    // @ts-ignore
    store.shop_image ||
    'https://via.placeholder.com/120x120.png?text=Store+Image'

const borderColor =
  store.status === 'active'
    ? 'border-t-3 border-green-500'
    : 'border-t-8 border-red-500'


  return (
    <>
      <div
        className={`bg-white ${borderColor} shadow rounded-lg p-4 flex flex-col w-50% max-w-lg mx-auto`}
      >
        {/* Store name */}
        <h3 className="text-xl font-semibold text-orange-600 text-center mb-1">
          {store.store_name}
        </h3>
        {/* Store header with image and owner */}
        <div className="flex flex-row items-center mb-4">
          <img
            src={storeImage}
            alt={store.store_name}
            className="w-full h-50 object-cover rounded-lg border border-gray-200 mb-2"
          />
        </div>

        {/* Opening and closing time */}
        <div className="flex flex-col justify-center gap-4 text-sm text-green-700 mb-2">
          <span>
            <span className="font-semibold">Opens:</span> {store.opening_time}
          </span>
          <span>
            <span className="font-semibold">Closes:</span> {store.closing_time}
          </span>
        </div>
        {/* Store description */}
        <div className="mb-1 text-gray-600 text-m text-center">
          <div>
            <span className="font-semibold">About Us:</span>
          </div>

          {store.description || (
            <span className="italic text-gray-400">
              No description provided.
            </span>
          )}
        </div>
        {/* Products */}
        {/* <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {store.products?.map((product) => (
          <span
            key={product.id}
            className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
          >
            {product.product_name}
          </span>
        ))}
      </div> */}
        {/* Shop Here button at the bottom */}
        <button
          className="bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600 w-full mt-auto"
          onClick={() => setShowProducts(true)}
        >
          Shop Here
        </button>
      </div>
      {/* Modal for store products */}
      {showProducts && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 w-full h-full">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[98vw] h-[96vh] relative overflow-auto">
            <button
              className="absolute top-2 right-2 text-orange-600 hover:text-orange-800 text-2xl"
              onClick={() => setShowProducts(false)}
            >
              &times;
            </button>
            <StoreDetails
              storeId={store.id ?? ''}
              onClose={() => setShowProducts(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default StoreCard