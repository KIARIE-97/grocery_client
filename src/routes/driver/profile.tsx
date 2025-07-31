import ProfileCardSection from '@/components/Admincomponents/ProfileCardSection'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/driver/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <ProfileCardSection />
  </div>
}
