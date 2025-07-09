import type { TOrder } from "./order.types"
import type { TProduct } from "./product.types"
import type { TUserData } from "./user.types"

export enum SStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export type TStore = {
  id:string
  store_name: string
  location: string
  is_verified: boolean
  status: SStatus
 user: TUserData
 products: TProduct[]
 orders: TOrder[]
}
export type TStoreForm = {
  store_name: string
  location: string
  is_verified: boolean
  user: number
}