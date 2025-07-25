// /driver/index.tsx

import GroceryLoader from '@/components/ui/GroceryLoader'
import { useAuth } from '@/hooks/UseAuth'
import { useSingleDriver } from '@/hooks/useUser'
import { authStore } from '@/store/authStore'
import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'

export const Route = createFileRoute('/driver/')({
  component: RouteComponent,
})

function RouteComponent() {
  const isAuthenticated = useStore(authStore, (state) => state.isAuthenticated)
  const driverId = useStore(authStore, (state) => state.driver?.id)
  const { data: driver, isLoading } = useSingleDriver(driverId ?? '')

  if (isLoading) {
    return (
      <div className="center m-50">
        <GroceryLoader />
      </div>
    )
  }

  if (!driver) {
    return <div>No driver data found.</div>
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col md:flex-row p-0 md:p-6 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-[#FF7929] rounded-xl p-4 md:mr-8 flex flex-col">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-white text-lg tracking-wide">
              {driver.id}
            </span>
            <span className="bg-[#251D1A] text-white px-3 py-1 rounded-full text-xs font-medium">
              {driver.vehicle_info}
            </span>
          </div>
          <div className="flex items-center mb-2">
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
            <span className="text-xs text-white font-semibold">
              {driver.is_available ? 'Available' : 'Not Available'}
            </span>
          </div>
        </div>
        <ul className="space-y-4 text-xs">
          <li className="flex items-center">
            <span className="w-2 h-2 mr-2 rounded-full bg-white"></span>
            <span className="text-white">
              Package has left Courier Facility
            </span>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 mr-2 rounded-full bg-white"></span>
            <span className="text-white">
              Package arrived at Local Facility
            </span>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 mr-2 rounded-full bg-[#FF7929] ring-2 ring-white"></span>
            <span className="text-white font-semibold">Out for Delivery</span>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 mr-2 rounded-full bg-white border"></span>
            <span className="text-white/70">Delivered</span>
          </li>
        </ul>
        <div className="mt-8">
          <div className="font-bold text-[#251D1A] mb-2">{driver.id}</div>
          <div className="flex flex-row space-x-2 mb-1">
            <span className="bg-[#CFF6DC] text-[#496763] py-1 px-2 text-[11px] rounded">
              in Transit
            </span>
            <span className="bg-white text-[#B7B7B7] py-1 px-2 text-[11px] rounded">
              Documents
            </span>
          </div>
          <span className="text-white/80 text-xs">
            Package has left Courier Facility
          </span>
        </div>
        <div className="mt-8 flex flex-row items-center space-x-2">
          <span className="text-[#FF7929]">Customs</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Truck Image and Info */}
          <div className="w-full md:w-2/3 space-y-4">
            <img
              src={
                // driver.user.profile_url ||
                'data:image/jpeg;base64,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'
              }
              alt={driver.vehicle_info}
              className="w-full rounded-xl object-cover mb-3"
              style={{ maxHeight: '210px', background: '#E8E8E8' }}
            />
            <div className="flex items-center justify-between">
              <div className="font-semibold text-[#2B2B2B]">
                {driver.vehicle_info}
              </div>
              <span className="text-xs text-[#FF7929] cursor-pointer hover:underline">
                View Documents
              </span>
            </div>
            <div className="bg-black text-white rounded px-3 py-2 inline-block font-mono text-lg tracking-widest">
              {driver.current_location}
            </div>
          </div>
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto">
            <StatCard
              label="Total Earnings"
              value={driver.total_earnings.toString()}
              unit="Ksh"
            />
            <StatCard
              label="Orders"
              value={driver.orders.length.toString()}
              unit="Count"
            />
            <StatCard
              label="Status"
              value={driver.is_available ? 'Available' : 'Unavailable'}
              unit=""
            />
          </div>
        </div>
        {/* Driver Profile and Delivery Details */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 mt-10">
          {/* Driver Card */}
          <div className="flex flex-row items-center bg-[#FF7929] rounded-xl p-4 w-full max-w-xs shadow-md">
            <div className="w-12 h-12 rounded-full bg-[#F7D6C4] flex items-center justify-center font-bold text-xl text-[#251D1A] mr-4">
              {driver.user.full_name.charAt(0)}
            </div>
            <div>
              <div className="text-xs text-[#251D1A]">Driver</div>
              <div className="text-[#2B2B2B] text-sm font-semibold">
                {driver.user.full_name}
              </div>
              <div className="text-xs text-[#2B2B2B] mt-1">
                {driver.user.phone_number}
              </div>
            </div>
          </div>
          {/* Address Card */}
          <div className="bg-[#2B2B2B] p-4 rounded-xl text-white w-full max-w-xs">
            <div className="text-sm">Address</div>
            <div className="font-bold mb-2">{driver.current_location}</div>
            <div className="text-xs mb-1">Delivery</div>
            <div className="flex items-center text-lg font-semibold">
              {/* Example: You can replace with actual delivery time if available */}
              1:30 PM <span className="mx-1">|</span> 31 Jan
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  unit: string
}

/* Statistic Card */
function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <div className="bg-white shadow rounded-xl p-4 flex flex-col items-center min-w-[105px]">
      <div className="text-2xl font-bold text-[#2B2B2B]">{value}</div>
      <div className="text-xs text-[#FF7929] font-semibold">{unit}</div>
      <div className="text-[11px] text-[#434343] mt-2">{label}</div>
    </div>
  )
}
