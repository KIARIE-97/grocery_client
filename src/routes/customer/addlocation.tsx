import { LocationForm } from '@/components/customer/Addlocation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/customer/addlocation')({
  component: LocationForm,
})