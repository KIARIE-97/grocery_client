import StoreDetails from '@/components/StoreDetails'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/storedetails')({
  component: StoreDetails,
})


