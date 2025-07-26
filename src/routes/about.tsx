import Footer from '@/components/bars/Footer'
import Navbar from '@/components/navbar'
import { useUsers } from '@/hooks/useUser'
import type { TUserData } from '@/types/user.types'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/about')({
  component: AboutComponent,
})

function AboutComponent() {
  const { data: users, isLoading, isError } = useUsers()
  console.log('users data', users)

  // Filter users by role (excluding customers)
  const userList = Array.isArray(users) ? users : []
  const admin = userList.find((user: TUserData) => user.role === 'admin')
  const storeOwners = userList.filter(
    (user: TUserData) => user.role === 'store_owner',
  )
  const drivers = userList.filter((user: TUserData) => user.role === 'driver')

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 mb-16"
        >
          <div className="md:w-1/2">
            <motion.h1
              className="text-4xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              About <span className="text-green-600">GrocerJet</span>
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              GrocerJet is a cutting-edge grocery delivery platform that
              connects customers with local stores and suppliers, ensuring fast
              and reliable delivery of fresh groceries and essentials.
            </motion.p>
            <motion.div
              className="text-gray-700 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p>
                Our on-demand grocery delivery platform is designed to simplify
                how people access fresh groceries, household essentials, and
                local produce—delivered straight to their doorstep. Whether
                you're shopping for your family or managing multiple orders, our
                seamless system ensures convenience, speed, and quality every
                step of the way.
              </p>
              <p>
                We partner with trusted stores and local vendors to offer a wide
                selection of products at competitive prices, while enabling
                store owners and suppliers to manage inventory, track orders,
                and serve customers efficiently. Drivers also benefit from smart
                delivery assignment and real-time route updates to ensure timely
                drop-offs.
              </p>
              <p>
                Built with modern technology and a user-first design, our
                platform supports multiple user roles—customers, store owners,
                drivers, and suppliers—making it a complete solution for the
                grocery delivery ecosystem. We're committed to delivering a
                reliable experience that connects communities to the essentials
                they need, faster and smarter.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="GrocerJet delivery"
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        {/* Stats Section */}
        <motion.section
          className="max-w-7xl mx-auto mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-green-600">10,000+</span>
              <span className="text-gray-600 mt-2">Customers Served</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-green-600">150+</span>
              <span className="text-gray-600 mt-2">Partner Stores</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-green-600">98%</span>
              <span className="text-gray-600 mt-2">On-Time Delivery</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-green-600">24/7</span>
              <span className="text-gray-600 mt-2">Support</span>
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Team
          </h2>

          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          )}

          {isError &&
            (console.log('Failed to load team members', isError),
            (
              <div className="text-center py-12 text-red-500">
                Failed to load team members
              </div>
            ))}

          {admin && (
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Leadership
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                >
                  <img
                    src={admin.profile_url}
                    alt={admin.full_name}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                  <h4 className="text-lg font-medium text-gray-900">
                    {admin.full_name}
                  </h4>
                  <p className="text-green-600">Founder/CEO</p>
                </motion.div>
              </div>
            </div>
          )}

          {storeOwners && storeOwners.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Store Owners
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {storeOwners.map((owner: TUserData) => (
                  <motion.div
                    key={owner.id}
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                  >
                    <img
                      src={owner.profile_url}
                      alt={owner.full_name}
                      className="w-20 h-20 rounded-full object-cover mb-4"
                    />
                    <h4 className="text-lg font-medium text-gray-900">
                      {owner.full_name}
                    </h4>
                    <p className="text-gray-600">Store Owner</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {drivers && drivers.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Delivery Drivers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {drivers.map((driver: TUserData) => (
                  <motion.div
                    key={driver.id}
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                  >
                    <img
                      src={driver.profile_url}
                      alt={driver.full_name}
                      className="w-20 h-20 rounded-full object-cover mb-4"
                    />
                    <h4 className="text-lg font-medium text-gray-900">
                      {driver.full_name}
                    </h4>
                    <p className="text-gray-600">Driver</p>
                    {driver.driver && (
                      <p className="text-sm text-gray-500 mt-1">
                        {/* Add any driver-specific info here */}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.section>
      </div>
      <Footer />
    </>
  )
}

