import type { TLocation } from "./location.types"
import type { TCartItem, TProduct } from "./product.types"
import type { TStore } from "./store.types"
import type { TDriver, TUserData } from "./user.types"

export type TOrder = {
  order_id: number
  total_amount: number
  tax_amount: number
  status:
    | 'pending'
    | 'accepted'
    | 'ready'
    | 'preparing'
    | 'out_for_delivery'
    | 'ready_for_pickup'
    | 'delivered'
    | 'cancelled'
    | 'failed'
  payment_method: 'credit_card' | 'paypal' | 'cash' | 'wallet'
  payment_status: 'pending' | 'success' | 'failed' | 'refunded'
  delivery_schedule_at: string
  driver: TDriver
  delivery_fee: number
  discount_amount: number
  store: TStore
  customer: TUserData
  products: TProduct[]
  delivery_address: TLocation
  created_at: string
}
export type UpdateOrderStatusInput = {
  orderId: string
status:
    | 'pending'
    | 'accepted'
    | 'ready'
    | 'preparing'
    | 'out_for_delivery'
    | 'ready_for_pickup'
    | 'delivered'
    | 'cancelled'
    | 'failed'  
    delivery_schedule_at?: string
}
export  type CheckoutProps = {
  order_id: string
  delivery_schedule_at: string | null
}
export type TCreateOrder = {
  // id: number
  product_ids: number[]
  customer_id: number
  total_amount: number
  tax_amount: number
  payment_method: 'mpesa' | 'paypal' | 'cash' | 'wallet'
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  delivery_schedule_at: string
  // status:
  //   | 'pending'
  //   | 'accepted'
  //   | 'out_for_delivery'
  //   | 'ready_for_pickup'
  //   | 'delivered'
  //   | 'cancelled'
  //   | 'failed'
}
export type TCartOrder = TCreateOrder & {
  id: number
}
