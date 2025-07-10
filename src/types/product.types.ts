import type { T } from 'node_modules/@faker-js/faker/dist/airline-CLphikKp'
import type { TCategory } from './category.types'
import type { TStore } from './store.types'

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
  categorys: TCategory[]
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
  quatity: number
  stock: number
  is_available: boolean
  store: TStore
}