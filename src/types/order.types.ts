export type TOrder = {
  order_id: number
  total_amount: number
  tax_amount: number
  status:
    | 'pending'
    | 'accepted'
    | 'out_for_delivery'
    | 'ready_for_pickup'
    | 'delivered'
    | 'cancelled'
    | 'failed'
  payment_method: 'credit_card' | 'paypal' | 'cash' | 'wallet'
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  delivery_schedule_at: string
  driver: string
  store: string
  customer: string
  products: string
}