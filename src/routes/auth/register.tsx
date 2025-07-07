import SignUp from '@/components/register'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <SignUp/>
  </div>
}
