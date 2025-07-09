import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/storeowners')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/storeowners"!</div>
}
