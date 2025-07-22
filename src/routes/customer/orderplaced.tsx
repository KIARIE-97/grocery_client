import OrderPlaced from '@/components/customer/OrderPlaced'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/customer/orderplaced')({
  component: OrderPlaced,
})

