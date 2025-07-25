import { useOrder } from '@/hooks/useOrder'
import { CheckCircle, Download, Mail, MapPin, Phone, Wallet } from 'lucide-react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { useSearch } from '@tanstack/react-router'
import GroceryLoader from '../ui/GroceryLoader'
import { useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import InvoicePDF from '../ui/InvoicePDF'

interface SearchParams {
  orderId?: string
}

export default function OrderPlaced() {
  const search = useSearch({ from: '/customer/orderplaced' })
  const orderId = (search as SearchParams).orderId?.replace(/"/g, '')
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false)
   const renderInvoiceButton = () => (
     <button
       onClick={() => setIsGeneratingInvoice(true)}
       className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600 transition flex items-center gap-2"
       disabled={isGeneratingInvoice}
     >
       {isGeneratingInvoice ? (
         order ? (
           <PDFDownloadLink
             document={<InvoicePDF order={order} companyName="Grocerjet" />}
             fileName={`invoice-${order.order_id}.pdf`}
             className="text-white flex items-center gap-2"
           >
             {({ loading }) => (
               <>
                 <Download className="w-4 h-4" />
                 {loading ? 'Preparing invoice...' : 'Download Invoice'}
               </>
             )}
           </PDFDownloadLink>
         ) : (
           <span>Loading invoice...</span>
         )
       ) : (
         <>
           <Download className="w-4 h-4" />
           Invoice
         </>
       )}
     </button>
   )

  const { data: order, isLoading, error } = useOrder(orderId ?? '')

  if (isLoading)
    return (
      <div className="center m-50">
        <GroceryLoader />
      </div>
    )

  if (error || !order) {
    console.error('Error fetching order:', error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-10 text-red-500"
      >
        {error ? `Error: ${error.message}` : 'Order not found'}
      </motion.div>
    )
  }

  const deliveryTime = order.delivery_schedule_at
    ? format(new Date(order.delivery_schedule_at), 'h:mmaaa')
    : 'N/A'

  const createdTime = order.created_at
    ? format(new Date(order.created_at), 'h:mmaaa')
    : 'N/A'


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-4 py-10"
    >
      <div className="flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <CheckCircle className="text-orange-500 w-14 h-14 mb-4" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-semibold mb-2"
        >
          Order Successfully Placed
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-sm mb-6 text-center"
        >
          Thank you for your order! You will receive your order between{' '}
          <strong>
            Today, {createdTime} - {deliveryTime}
          </strong>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white shadow rounded-lg w-full"
        >
          <div className="border-b p-4 flex items-center gap-2 text-sm font-medium text-gray-700">
            <Mail className="text-orange-500 w-5 h-5" />
            Your order will be sent to this address
          </div>

          <div className="p-4 space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1" />
              <span>
                Address:{' '}
                <span className="font-medium">
                  {order.delivery_address?.addressLine1 || 'N/A'}
                </span>
              </span>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 mt-1" />
              <span>
                Phone Number:{' '}
                <span className="font-medium">
                  {order.customer?.phone_number || 'N/A'}
                </span>
              </span>
            </div>

            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-1" />
              <span>
                Email Address:{' '}
                <span className="font-medium">
                  {order.customer?.email || 'N/A'}
                </span>
              </span>
            </div>

            <div className="flex items-start gap-2">
              <Wallet className="w-4 h-4 mt-1" />
              <span>
                Payment Method:{' '}
                <span className="capitalize font-medium">
                  {order.payment_method || 'N/A'}
                </span>
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto px-4 py-10"
          >
            <div className="border-t px-4 py-3 flex justify-between items-center text-sm">
              <span className="text-gray-700">Stay Home 😊</span>
              {renderInvoiceButton()}
            </div>

            {/* ... (keep the rest of your existing JSX) */}
          </motion.div>

          <div className="border-t px-4 py-3 text-sm text-center text-gray-700">
you add a tip for the delivery person😊
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
