import { Checkout } from '@/components/customer/Mycheckout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/customer/checkout')({
  component: Checkout,
})


