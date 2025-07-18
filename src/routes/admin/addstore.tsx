import { AddShopForm } from '@/components/Admincomponents/AddStore'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/addstore')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    
    <AddShopForm/>
  )
}
