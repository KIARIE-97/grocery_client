import CustomersTable from '@/components/Admincomponents/Customer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/customers')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
<CustomersTable/>
  )
}
