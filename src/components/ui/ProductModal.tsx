import type { TProduct } from '@/types/product.types'
import React, { useState } from 'react'

export function ProductModal({
  product,
  onClose,
}: {
  product: TProduct 
  onClose: () => void
}) {
  if (!product) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <img
            src={product.product_image}
            alt={product.product_name}
            className="w-24 h-24 object-contain mb-4 rounded shadow"
          />
          <h2 className="font-bold text-xl mb-2">{product.product_name}</h2>
        </div>
        <div className="grid grid-cols-2 text-center my-4 border rounded">
          <div className="py-2 border-r">
            <span className="font-semibold">Orders</span>
            <div>
              <span className="inline-block bg-orange-500 text-white rounded px-2 ml-2">
{Array.isArray(product.orders) ? product.orders.length : 0}
              </span>
            </div>
          </div>
          <div className="py-2">
            <span className="font-semibold">Stock</span>
            <div>
              <span className="inline-block bg-orange-500 text-white rounded px-2 ml-2">
               {product.stock || 'N/A'}
              </span>
            </div>
          </div>
        </div>
        <div className="border rounded p-4">
          <div className="flex justify-between py-1">
            <span>Price</span>
            <span className="font-semibold">${product.product_price}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Status</span>
            <span className="font-semibold">
              {product.is_available ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span>Created</span>
            <span className="font-semibold">
              {product.created_at
                ? new Date(product.created_at).toLocaleString()
                : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}