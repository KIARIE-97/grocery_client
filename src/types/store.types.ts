import type { TOrder } from "./order.types"
import type { TProduct } from "./product.types"
import type { TUserData } from "./user.types"

export enum SStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export type TStore = {
  id: string | undefined
  store_name: string
  location: string
  is_verified: boolean
  status: SStatus
  opening_time: string
  user: TUserData
  closing_time: string
  description: string
  shop_image: string
  products: TProduct[]
  orders: TOrder[]
}
export type TStoreForm = {
  store_name: string
  shop_image: string
  location: string
  is_verified: boolean
  user: number
}