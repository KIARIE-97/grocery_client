import DashboardOverview from '@/components/store_owner/Dashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/store_owner/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto p-6">
          {/* Main Content */}
          <div className="container mx-auto">

            <DashboardOverview />
          </div>
        </main>
      </div>
    </div>
  )
}
