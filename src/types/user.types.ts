import type { TOrder } from "./order.types"
import type { TProduct } from "./product.types"

export type TUserData = {
  id: string
  full_name: string
  email: string
  password: string
  phone_number: string
  profile_url: string
  is_active: boolean;
  role: 'customer' | 'store_owner' | 'driver' | 'admin'
  driver: TDriver | null
}
export type TDriver = {
  id: string
  vehicle_info: string
  is_available: boolean
  current_location: string
  total_earnings: number
  user: TUserData
  orders: TOrder[]
}
export type TupdateUserData = {
  full_name: string
  email: string
  password: string
  phone_number: string
 
}
export type TEditUser = {
  [x: string]: string
  full_name: string
  email: string
  phone_number: string
  profile_url: string
}
export interface IAuth {
  email: string
  password: string
}

export interface IAuthState {
  driver: TDriver | null
  user: TUserData | null
  token: string | null
  isAuthenticated: boolean
}
export interface IOrder {
  id: number
  order_id: string
  delivery_schedule_at: string
  payment_method: string
  payment_status: string
  status: string
  products: TProduct[]
  total_amount: number
  created_at: string
  updated_at: string
}
export interface ICustomer {
  profile_url: string | null
  full_name: string
  phone_number: string
  email: string
  orders: IOrder[]
}