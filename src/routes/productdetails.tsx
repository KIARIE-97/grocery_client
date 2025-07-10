import ProductDetails from '@/components/ProductDetails'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/productdetails')({
  component: ProductDetails,
})

