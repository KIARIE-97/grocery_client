import AddressComponent from '@/components/customer/Address'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/customer/address')({
  component: AddressComponent,
})


