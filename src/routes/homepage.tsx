import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/homepage')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/homepage"!</div>
}
