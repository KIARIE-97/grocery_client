import { useAuth } from '@/hooks/UseAuth'
import { useSingleCustomer } from '@/hooks/useUser'
import { createFileRoute } from '@tanstack/react-router'
import { Bell, CreditCard, ShoppingBag, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePaymentsByUser } from '@/hooks/usePayment'
import GroceryLoader from '@/components/ui/GroceryLoader'
import type { TPayment } from '@/types/payment.tpyes'

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
    Payments: TPayment[]
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
    return (
      <div className="center m-50">
        <GroceryLoader />
      </div>
    )
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
const totalSpent = Array.isArray(customerData.Payments)
  ? customerData.Payments.reduce((sum, payment) => {
      const amount = parseFloat(String(payment.amount)) || 0;
      return sum + amount;
    }, 0)
  : 0; 
   

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans">
      <header className="bg-gradient-to-r from-[#E15B18] to-[#C9AB3D] p-6 flex flex-col items-center gap-4 text-white">
        <motion.img
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
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
          className="text-center"
        >
          <h1 className="text-xl font-bold text-white">
            {customerData.full_name}
          </h1>
          <p className="text-sm text-white/90">{customerData.phone_number}</p>
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
              className="bg-white p-6 rounded-lg shadow-md border border-[#678272]/20"
            >
              <h2 className="text-xl font-semibold mb-4 text-[#4A7004] border-b border-[#678272]/30 pb-2">
                Overview
              </h2>

              {/* My Rewards Section */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="mb-6 p-4 border-b border-[#678272]/20"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-[#4A7004]">
                    My Rewards
                  </h3>
                  <span className="text-sm bg-[#C9AB3D]/10 text-[#C9AB3D] px-2 py-1 rounded-full">
                    6 Rewards
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#E15B18] font-medium hover:text-[#C9AB3D] transition-colors">
                    Rewards and Details
                  </span>
                  <ChevronRight className="text-[#E15B18]" size={16} />
                </div>
              </motion.div>

              {/* My Orders Section */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="mb-6 p-4 border-b border-[#678272]/20"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-[#4A7004]">
                    My Orders
                  </h3>
                  <span className="text-sm bg-[#4A7004]/10 text-[#4A7004] px-2 py-1 rounded-full">
                    {outForDeliveryOrders.length} Recently Purchased
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    {totalItemsOutForDelivery} Items
                  </span>
                  <span className="text-sm font-medium bg-[#C9AB3D]/20 text-[#C9AB3D] px-2 py-1 rounded-full">
                    On the way
                  </span>
                  {outForDeliveryOrders.length > 0 && (
                    <span className="text-sm font-medium text-gray-700">
                      #{outForDeliveryOrders[0].id.slice(-3)}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* My Wallet Section */}
              <motion.div whileHover={{ scale: 1.02 }} className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-[#4A7004]">
                    My Wallet
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium bg-[#678272]/10 text-[#678272] px-2 py-1 rounded-full">
                      3 offers Active
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-2xl font-bold text-[#E15B18]">
                    Credits KES{payments?.balance || '100'}
                  </p>
                </div>
                <div className="flex gap-4 mb-3 text-sm">
                  <span className="text-[#4A7004] font-medium hover:text-[#678272] transition-colors">
                    Payment Methods
                  </span>
                  <span className="text-[#4A7004] font-medium hover:text-[#678272] transition-colors">
                    Points Earning
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#4A7004] font-medium hover:text-[#678272] transition-colors">
                    Rewards and Details
                  </span>
                  <ChevronRight className="text-[#678272]" size={16} />
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
              className="bg-gradient-to-br from-[#4A7004]/10 to-[#678272]/10 p-6 rounded-lg shadow-md border border-[#4A7004]/20 flex items-center gap-4"
            >
              <div className="bg-[#4A7004]/20 p-3 rounded-full">
                <CreditCard className="text-[#4A7004]" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#4A7004]">
                  Total Spent
                 </h3>
                <p className="text-2xl text-[#E15B18] font-bold">
                  KES{totalSpent.toFixed(2)}
                </p>
              </div>
            </motion.div>

            {/* Recent Orders Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-[#C9AB3D]/10 to-[#E15B18]/10 p-6 rounded-lg shadow-md border border-[#C9AB3D]/20 flex items-center gap-4"
            >
              <div className="bg-[#C9AB3D]/20 p-3 rounded-full">
                <ShoppingBag className="text-[#C9AB3D]" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#C9AB3D]">
                  Total Orders
                </h3>
                <p className="text-2xl text-[#4A7004] font-bold">
                  {customerData.orders.length}
                </p>
              </div>
            </motion.div>

            {/* Notifications Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-[#E15B18]/10 to-[#C9AB3D]/10 p-6 rounded-lg shadow-md border border-[#E15B18]/20 flex items-center gap-4"
            >
              <div className="bg-[#E15B18]/20 p-3 rounded-full">
                <Bell className="text-[#E15B18]" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#E15B18]">
                  Notifications
                </h3>
                <p className="text-2xl text-[#678272] font-bold">5 New</p>
              </div>
            </motion.div>
          </section>
        </motion.div>
      </main>
    </div>
  )
}
