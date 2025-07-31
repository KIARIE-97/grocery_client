import { createFileRoute } from '@tanstack/react-router'
import { useStores } from '@/hooks/useStore'
import { useOrders } from '@/hooks/useOrder'
import Navbar from '@/components/navbar'
import Footer from '@/components/bars/Footer'
import GroceryLoader from '@/components/ui/GroceryLoader'
import { motion } from 'framer-motion'
import StoreCard from '@/components/store_owner/Store'

export const Route = createFileRoute('/allstores')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: stores, isLoading: storesLoading } = useStores()
  const { data: orders, isLoading: ordersLoading } = useOrders()

  if (storesLoading || ordersLoading)
    return (
      <div className="center m-50">
        <GroceryLoader />
      </div>
    )

  if (!stores) return <div>No stores found.</div>

  const storeArray = Array.isArray(stores) ? stores : []
  const ordersArray = Array.isArray(orders) ? orders : []

  // Animation variants for the grid
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <motion.h1
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Discover Local Stores
          </motion.h1>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {storeArray.map((store, index) => (
              <motion.div
                key={store.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                <StoreCard store={store} orders={ordersArray} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
