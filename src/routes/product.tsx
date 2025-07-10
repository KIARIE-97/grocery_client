import Products from '@/components/Products'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/product')({
  component: Products,
})

