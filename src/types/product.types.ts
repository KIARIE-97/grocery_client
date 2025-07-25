import type { TCategory } from './category.types'
import type { TOrder } from './order.types'
import type { TStore } from './store.types'

export type TProduct = {
  id: number
  product_name: string
  product_description: string
  product_price: number
  quantity: number
  stock: number
  size: string
  is_available: boolean
  product_image: string
  created_at: string
  orders: TOrder []
  categories: TCategory[]
  store: TStore
  ratings?: []
}
export type TCartItem = {
    id: number;
    product_name: string;
    product_price: number;
    product_image: string;
    size: string;
    quantity: number;
}
export type TProductForm = {
  product_name: string
  product_description: string
  product_price: number
  quantity: number
  stock: number
  size: string
  is_available: boolean
  product_image: File | string | null
  category_id: string
  categories?: number[]
}
export type Store = {
  store_name: string
  location: string
  is_verified: boolean
}

export type SProduct = {
  product_image?: string
  product_name: string
  product_description: string
  product_price: number
  quantity: number
  stock: number
  is_available: boolean
  store: TStore
}