import React from 'react'
import { Edit, Trash2 } from 'lucide-react'

type Address = {
  label: string
  details: string
}

const AddressComponent: React.FC = () => {
  const addressList: Address[] = [
    {
      label: 'Home',
      details: '#0000, St No. 8, Moi Avenue, Nairobi, 00100',
    },
    {
      label: 'Office',
      details: '#0000, St No. 8, Kenyatta Avenue, Nairobi, 00100',
    },
    {
      label: 'Other',
      details: '#0000, St No. 8, Tom Mboya Street, Nairobi, 00100',
    },
  ]

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Address</h2>
      <button className="bg-orange-500 text-white px-5 py-2 rounded mb-6 hover:bg-orange-600 transition">
        Add New Address
      </button>
      <div className="space-y-4">
        {addressList.map((address, index) => (
          <div
            key={index}
            className="flex justify-between items-start border border-gray-300 p-4 rounded-md"
          >
            <div>
              <h3 className="font-semibold text-gray-700">{address.label}</h3>
              <p className="text-sm text-gray-600">{address.details}</p>
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
        ))}
      </div>
    </div>
  )
}

export default AddressComponent
