// routes/customer.tsx
import { useAuth } from '@/hooks/UseAuth'
import { useSingleCustomer } from '@/hooks/useUser'
import { createFileRoute } from '@tanstack/react-router'
import { Bell, CreditCard, ShoppingBag, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePaymentsByUser } from '@/hooks/usePayment'
import GroceryLoader from '@/components/ui/GroceryLoader'

export const Route = createFileRoute('/customer/')({
  component: CustomerDashboard,
})

function CustomerDashboard() {
  const { user } = useAuth()
  const userId = user?.id ?? ''

  interface OrderItem {
    quantity: number
    // add other properties if needed
  }

  interface Order {
    id: string
    status: string
    items: OrderItem[]
    // add other properties if needed
  }

  interface Customer {
    profile_url: string
    full_name: string
    phone_number: string
    orders: Order[]
  }

  const {
    data: customerData,
    isLoading,
    error,
  } = useSingleCustomer(userId) as {
    data: Customer | undefined
    isLoading: boolean
    error: unknown
  }
  const { data: payments, isLoading: paymentsLoading } = usePaymentsByUser(
    Number(userId),
  )

  if (isLoading || paymentsLoading)
    return <div className="center m-50">
      <GroceryLoader />
    </div>
  if (error || !customerData)
    return (
      <div className="p-6 text-center text-red-500">Error loading profile</div>
    )

  // Filter orders to only those with "out for delivery" status
  const outForDeliveryOrders = customerData.orders.filter(
    (order) => order.status === 'out for delivery',
  )

  // Calculate total items in out for delivery orders
  const totalItemsOutForDelivery = outForDeliveryOrders.reduce(
    (total, order) =>
      total + order.items.reduce((sum, item) => sum + item.quantity, 0),
    0,
  )

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <header className="bg-orange-200 p-6 flex flex-col items-center gap-4">
        <motion.img
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
          src={
            customerData.profile_url ||
            'https://static.vecteezy.com/system/resources/previews/014/277/912/original/trendy-stylish-girl-vector.jpg'
          }
          alt="Profile"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-xl font-bold text-gray-800">
            {customerData.full_name}
          </h1>
          <p className="text-sm text-gray-600">{customerData.phone_number}</p>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <section className="lg:col-span-3 space-y-6">
            <motion.div
              variants={itemVariants}
              className="bg-white p-6 rounded-lg shadow"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Overview
              </h2>

              {/* My Rewards Section */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="mb-6 p-4 border-b border-gray-100"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">My Rewards</h3>
                  <span className="text-sm text-gray-500">6 Rewards</span>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className="text-sm font-medium bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    Yes to:
                  </span>
                  <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Won on On
                  </span>
                  <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                    Crafted to
                  </span>
                  <span className="text-sm font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    +Move
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-600 font-medium">
                    Rewards and Details
                  </span>
                  <ChevronRight className="text-gray-400" size={16} />
                </div>
              </motion.div>

              {/* My Orders Section */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="mb-6 p-4 border-b border-gray-100"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">My Orders</h3>
                  <span className="text-sm text-gray-500">
                    {outForDeliveryOrders.length} Recently Purchased
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium">
                    {totalItemsOutForDelivery} Items
                  </span>
                  <span className="text-sm font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    On the way
                  </span>
                  {outForDeliveryOrders.length > 0 && (
                    <span className="text-sm font-medium">
                      #{outForDeliveryOrders[0].id.slice(-3)}
                    </span>
                  )}
                </div>
               
              </motion.div>

              {/* My Wallet Section */}
              <motion.div whileHover={{ scale: 1.02 }} className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">My Wallet</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                      3 offers Active
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-2xl font-bold">
                    Credits KES{payments?.balance || '100'}
                  </p>
                </div>
                <div className="flex gap-4 mb-3 text-sm">
                  <span className="text-blue-600 font-medium">
                    Payment Methods
                  </span>
                  <span className="text-blue-600 font-medium">
                    Points Earning
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-600 font-medium">
                    Rewards and Details
                  </span>
                  <ChevronRight className="text-gray-400" size={16} />
                </div>
              </motion.div>
            </motion.div>
          </section>

          {/* Sidebar Section */}
          <section className="lg:col-span-1 space-y-6">
            {/* Wallet Balance Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow flex items-center gap-4"
            >
              <CreditCard className="text-orange-500" size={32} />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Wallet Balance
                </h3>
                <p className="text-2xl text-green-600 font-bold">
                  KES{payments?.balance || '100'}
                </p>
              </div>
            </motion.div>

            {/* Recent Orders Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow flex items-center gap-4"
            >
              <ShoppingBag className="text-blue-500" size={32} />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Orders
                </h3>
                <p className="text-2xl text-blue-700 font-bold">
                  {customerData.orders.length}
                </p>
              </div>
            </motion.div>

            {/* Notifications Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow flex items-center gap-4"
            >
              <Bell className="text-yellow-500" size={32} />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Notifications
                </h3>
                <p className="text-2xl text-yellow-700 font-bold">5 New</p>
              </div>
            </motion.div>
          </section>
        </motion.div>
      </main>
    </div>
  )
}
