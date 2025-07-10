export type TUserData = {
  id: string
  full_name: string
  email: string
  password: string
  phone_number: string
  profile_url: string
  is_active: boolean;
  role: 'customer' | 'store_owner' | 'driver' | 'admin'
}

export interface IAuth {
  email: string
  password: string
}

export interface IAuthState {
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