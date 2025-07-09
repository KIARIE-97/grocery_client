import type { TCategory } from "./category.types"

export type TProduct = {
  id: number
  store: number
  product_name: string
  product_description: string
  product_price: number
  quatity: number
  stock: number
  size: string
  is_available: boolean
  product_image: string
  categorys: TCategory
}
export type TProductForm = {
  product_name: string
  product_description: string
  product_price: number
  quatity: number
  stock: number
  size: string
  is_available: boolean
  product_image: File | string | null
}