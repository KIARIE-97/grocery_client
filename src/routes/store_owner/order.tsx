import StoreOwnerOrders from '@/components/store_owner/Orders'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/store_owner/order')({
  component: StoreOwnerOrders,
})


