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
              Grover is better here. GrocerJet is revolutionizing on-demand
              delivery with our cutting-edge technology platform.
            </motion.p>
            <motion.div
              className="text-gray-700 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p>
                You have also been a member of the world's leading
                international, digital division and human industry. We are proud
                of all our new technology and innovation in this country.
              </p>
              <p>
                We are committed to creating a new technology and innovation
                that will help us improve our environmental capabilities and
                make it easier for people to thrive.
              </p>
              <p>
                Our company has a successful growth in its operations and we are
                committed to developing a new technology and innovation that
                will help us improve our environment.
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
        <motion.section
          className="max-w-7xl mx-auto mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    400+
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    5th
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    1/4 days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    90%
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    People focused on young people as a trusted scientist
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Most of our high quality talent team
                  </td>
                  <td colSpan={2} className="px-6 py-4 text-sm text-gray-500">
                    Projected through 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
                    31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
                    46, 47, 48, 49, 50
                  </td>
                </tr>
              </tbody>
            </table>
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

