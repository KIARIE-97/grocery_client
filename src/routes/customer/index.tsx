// routes/customer.tsx
import { useAuth } from '@/hooks/UseAuth'
import { useSingleCustomer } from '@/hooks/useUser'
import { createFileRoute } from '@tanstack/react-router'
import { Bell, CreditCard, ShoppingBag } from 'lucide-react'



export const Route = createFileRoute('/customer/')({
  component: CustomerDashboard,
})

function CustomerDashboard() {
  const { user } = useAuth()
  interface Customer {
    profile_url: string
    full_name: string
    phone_number: string
    orders: []
  }

  const { data: customerData, isLoading, error } = useSingleCustomer(user?.id ?? '') as {
    data: Customer | undefined
    isLoading: boolean
    error: unknown
  }
console.log('Customer Data:', customerData)

  if (isLoading) return <div className="p-6 text-center">Loading...</div>
  if (error || !customerData)
    return (
      <div className="p-6 text-center text-red-500">Error loading profile</div>
    )

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <header className="bg-orange-100 p-6 flex items-center gap-4">
        <img
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
          src={customerData?.profile_url}
          alt="Profile"
        />
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            {customerData.full_name}
          </h1>
          <p className="text-sm text-gray-600">{customerData.phone_number}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <section className="lg:col-span-3 space-y-6">
            {/* You can insert the updated content panels here */}
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                Welcome back, {customerData.full_name}!
              </h2>
              {/* wallet */}
              <div className="bg-white p-6 rounded shadow flex items-center gap-4">
                <CreditCard className="text-orange-500" size={32} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Wallet Balance
                  </h3>
                  <p className="text-2xl text-green-600 font-bold">
                    Ksh 3,200.00
                  </p>
                </div>
              </div>
              {/* Recent Orders */}
              <div className="bg-white p-6 rounded shadow flex items-center gap-4">
                <ShoppingBag className="text-blue-500" size={32} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Total Orders
                  </h3>
                  <p className="text-2xl text-blue-700 font-bold">{customerData.orders.length}</p>
                </div>
              </div>
              {/* Notifications */}
              <div className="bg-white p-6 rounded shadow flex items-center gap-4">
                <Bell className="text-yellow-500" size={32} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Notifications
                  </h3>
                  <p className="text-2xl text-yellow-700 font-bold">5 New</p>
                </div>
            </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
