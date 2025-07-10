import OrderDetail from '@/components/customer/OrderDetail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/customer/orderdetail')({
  component: OrderDetail,
})


