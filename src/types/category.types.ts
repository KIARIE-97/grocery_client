import type { TProduct } from "./product.types"

export type TCategory = {
  category_name: string
  description?: string
  image?: string
  products: TProduct[]
}