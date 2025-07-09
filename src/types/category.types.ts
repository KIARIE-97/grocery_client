import type { TProduct } from "./product.types"

export type TCategory = {
  id: string
  category_name: string
  products: TProduct[]
}