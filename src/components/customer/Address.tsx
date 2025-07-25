import React from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useUserLocations } from '@/hooks/useLocation'
import GroceryLoader from '../ui/GroceryLoader'

type Address = {
  label: string
  addressLine1: string
  city: string
  state: string
  country: string
  postalCode: string
  email?: string
}

const AddressComponent: React.FC = () => {
  const { data: addressList = [] , isLoading} = useUserLocations()

  if (isLoading) {
    return (
      <div className="center m-50">
        <GroceryLoader />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Address</h2>
      <Link to="/customer/addlocation">
        <button className="bg-orange-500 text-white px-5 py-2 rounded mb-6 hover:bg-orange-600 transition">
          Add New Address
        </button>
      </Link>
      <div className="space-y-4">
        {addressList.length === 0 ? (
          <p className="text-gray-500">No addresses found.</p>
        ) : (
          addressList.map((address: Address, index: number) => (
            <div
              key={index}
              className="flex justify-between items-start border border-gray-300 p-4 rounded-md"
            >
              <div>
                <h3 className="font-semibold text-gray-700 capitalize">{address.label}</h3>
                <p className="text-sm text-gray-600">{address.addressLine1}</p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.state}, {address.country} {address.postalCode}
                </p>
                {address.email && (
                  <p className="text-sm text-gray-600">Email: {address.email}</p>
                )}
              </div>
              <div className="flex space-x-4 mt-2 sm:mt-0">
                <button className="text-blue-600 hover:text-blue-800 transition">
                  <Edit size={18} />
                </button>
                <button className="text-red-600 hover:text-red-800 transition">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AddressComponent