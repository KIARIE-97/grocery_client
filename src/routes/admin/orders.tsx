import Orders from '@/components/Admincomponents/Orders'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/orders')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Orders/>
  )
}
