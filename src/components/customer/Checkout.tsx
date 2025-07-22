import React, { useState } from 'react'
import { useOrder } from '@/hooks/useOrder'
import { useCreatePayment } from '@/hooks/usePayment'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type PaymentFormProps = {
  orderId: string
  onPaymentSuccess?: (payment: any) => void
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  orderId,
  onPaymentSuccess,
}) => {
  const { data: order, isLoading: orderLoading } = useOrder(orderId)
  const createPayment = useCreatePayment()

  const [showPhoneDialog, setShowPhoneDialog] = useState(false)
  const [phone_number, setPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('mpesa') // or card, etc.

  // Handle payment submission
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone_number) {
      setShowPhoneDialog(true)
      return
    }
    createPayment.mutate(
      {
        orderId,
        phone_number,
        amount: order?.total_amount || 0,
        paymentMethod,
      },
      {
        onSuccess: (payment) => {
          onPaymentSuccess?.(payment)
        },
      },
    )
  }

  if (orderLoading) return <div>Loading order...</div>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment</h2>
      <form onSubmit={handlePayment} className="flex flex-col gap-4">
        {/* Phone input trigger */}
        <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-blue-600 underline"
              onClick={() => setShowPhoneDialog(true)}
            >
              {phone_number
                ? `phone_number: ${phone_number}`
                : 'Add phone number'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Phone Number</DialogTitle>
            </DialogHeader>
            <Input
              type="tel"
              value={phone_number}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +2547xxxxxxx"
              autoFocus
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPhoneDialog(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  type="button"
                  onClick={() => setShowPhoneDialog(false)}
                  disabled={!phone_number}
                >
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment method (expand as needed) */}
        <div>
          <label className="block mb-1 font-medium">Payment Method</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="mpesa">M-Pesa</option>
            <option value="card">Card</option>
            {/* Add other options */}
          </select>
        </div>

        <Button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={createPayment.isPending}
        >
          {createPayment.isPending ? 'Processing Payment...' : 'Pay Now'}
        </Button>
        {createPayment.isError && (
          <div className="text-red-600 text-sm">
            {createPayment.error?.message || 'Payment failed. Try again.'}
          </div>
        )}
      </form>
    </div>
  )
}

// import React, { useState } from 'react'
// import { useForm } from '@tanstack/react-form'
// import { useOrder, useUpdateOrder } from '@/hooks/useOrder'
// import { useUserLocations } from '@/hooks/useLocation'
// import { useCreatePayment } from '@/hooks/usePayment'
// import { useSearch } from '@tanstack/react-router'
// import { useNavigate } from '@tanstack/react-router'
// import type { TPayment } from '@/types/payment.tpyes'

// interface CheckoutProps {
//   orderId: string
//   onPaymentSuccess?: (payment: any) => void
// }

// export const Checkout: React.FC<CheckoutProps> = () => {
//   interface SearchParams {
//     orderId?: string;
//   }
//   const search = useSearch({ from: '/customer/checkout' });

//   const orderId = (search as SearchParams).orderId?.replace(/"/g, '')
//     // console.log('orderId:', orderId) 
//     const { data: order } = useOrder(orderId || '')
//   const { data: locations, isLoading: locationsLoading } = useUserLocations()
//   const updateOrder = useUpdateOrder()
//   const createPayment = useCreatePayment()
//   const navigate = useNavigate()
// // console.log('Order data:', order)



//   // Step state
//   const [step, setStep] = useState(2)
//   const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
//     null,
//   )
//   const [deliveryDate, setDeliveryDate] = useState<string | null>(null)
//   const [deliveryTime, setDeliveryTime] = useState<string | null>(null)
//   const [paymentMethod, setPaymentMethod] = useState('mpesa')
//     const [phone_number, setPhone] = useState('')

//   // Payment form using TanStack Form
// const form = useForm({
//   defaultValues: { phone_number: '' },

//   onSubmit: async ({ value }) => {
  
//     console.log('Form submitted with:', value)
//     alert('Processing payment...')
//     createPayment.mutate(
//       {
//         orderId: orderId || '',
//         phone_number: value.phone_number,
//         amount: order?.total_amount || 0,
//         paymentMethod,
//       },
//       {
//         onSuccess: (payment) => {
//           alert('Payment successful!')
//           console.log('SUCCESS:', payment)
//           // onPaymentSuccess?.(payment)
//           // navigate({
//           //   to: '/customer/orderplaced',
//           //   search: { orderId },
//           // })
//         },
//         onError: (error) => {
//           alert('Payment failed. Please try again.')
//           console.error('Payment error:', error)
//         },
//       },
//     )
//   },
// })

//  const proceedToDelivery = () => {
//     console.log('Selected address ID:', selectedAddressId)
//     // if (isLoading) return <div>Loading order...</div>
//     // if (error) return <div>Error loading order: {error.message}</div>
//     // if (!order) return <div>No order found.</div>
    
//     console.log('Full order object:', order)
//     console.log('Order customer ID:', order?.customer?.id)
//     console.log('typeof order.customer.id:', typeof order?.customer?.id);
    
//     // Find the selected address
//     const addressToUse = locations?.find(
//         (loc: any) => loc.id === selectedAddressId,
//     )
//     console.log('Address to use:', addressToUse.ownerId)
//     console.log('typeof addressToUse.ownerId:', typeof addressToUse?.ownerId)
//    // Check if the address belongs to the current order's customer
//    if (addressToUse && String(order?.customer?.id) === addressToUse.ownerId) {
   
//      // Update order only if address is different
//     //  if (order?.delivery_address.addressLine1 !== addressToUse.addressLine1) {
//     //    updateOrder.mutate({ orderId, delivery_address: addressToUse.id })
//     //  }
//      // Optionally display the address here (e.g. set a state to show it)
//      setStep(3)
//    } else {
//      // Optionally show an error or warning that address does not belong to user
//      alert('Selected address does not belong to you.')
//    }
//  }

//   const proceedToPayment = async () => {
//     if (deliveryDate && deliveryTime) {
//       // Format and update delivery_scheduled_at
//       const scheduledAt = `${deliveryDate}T${deliveryTime}`
//        updateOrder.mutate({
//          order_id: orderId || '',
//          delivery_schedule_at: scheduledAt,
//        })
//       setStep(4)
//     }
//   }
// const handleFormSubmit = async ({ value }: any) => {
//  try {
//    createPayment.mutate(
//      { orderId: orderId || '', phone_number: value.phone_number, amount: order?.total_amount || 0, paymentMethod },
//      {
//        onSuccess: (data) => {
//          console.log('SUCCESS:', data)
//          navigate({ to: '/customer/orderplaced', search: { orderId } })
//        },
//        onError: (error) => {
//          console.error('Payment failed:', error)
//        },
//      },
//    )
//  } catch (err) {
//    console.error('Caught error:', err)
//  }
// };
//   // const handlePlaceOrder = async () => {
//   //   if (form.state.isSubmitting) return
//   //   form.handleSubmit()
//   //   console.log('Payment success, navigating...')
//   //   navigate({
//   //     to: '/customer/orderplaced',
//   //     search: { orderId }, 
//   //   })
//   // }

//   return (
//     <div className="flex flex-row p-6 bg-gray-50 min-h-screen">
//       <div className="flex-1 max-w-xl">
//         {/* Step 2: Address Selection */}
//         {step === 2 && (
//           <div>
//             <h2 className="text-lg font-semibold mb-4">2. Delivery Address</h2>
//             {locationsLoading ? (
//               <div>Loading addresses...</div>
//             ) : (
//               <div className="space-y-4">
//                 {locations?.map((loc: any) => (
//                   <button
//                     key={loc.id}
//                     onClick={() => setSelectedAddressId(loc.id)}
//                     className={`block w-full text-left p-4 border rounded ${
//                       selectedAddressId === loc.id
//                         ? 'border-orange-500 bg-orange-50'
//                         : 'border-gray-200'
//                     }`}
//                   >
//                     <span className="font-medium">{loc.label}</span>
//                     <div className="text-sm text-gray-500">{loc.address}</div>
//                   </button>
//                 ))}
//               </div>
//             )}
//             <button
//               className="mt-6 px-6 py-2 bg-orange-500 text-white rounded"
//               disabled={!selectedAddressId}
//               onClick={proceedToDelivery}
//             >
//               Next
//             </button>
//           </div>
//         )}

//         {/* Step 3: Delivery Time & Date */}
//         {step === 3 && (
//           <div>
//             <h2 className="text-lg font-semibold mb-4">
//               3. Delivery Time & Date
//             </h2>
//             {/* Example: dates for the next 7 days */}
//             <div className="flex gap-2 mb-4">
//               {[...Array(7).keys()].map((i) => {
//                 const date = new Date()
//                 date.setDate(date.getDate() + i)
//                 const dateStr = date.toISOString().split('T')[0]
//                 const label = i === 0 ? 'Tomorrow' : date.toLocaleDateString()
//                 return (
//                   <button
//                     key={dateStr}
//                     onClick={() => setDeliveryDate(dateStr)}
//                     className={`px-4 py-2 rounded ${
//                       deliveryDate === dateStr
//                         ? 'bg-orange-500 text-white'
//                         : 'bg-purple-900 text-white'
//                     }`}
//                   >
//                     {label}
//                   </button>
//                 )
//               })}
//             </div>
//             {/* Example: time slots */}
//             <div className="space-y-2">
//               {['08:00', '10:00', '12:00', '14:00', '16:00'].map((slot) => (
//                 <label
//                   className="flex items-center gap-3 cursor-pointer"
//                   key={slot}
//                 >
//                   <input
//                     type="radio"
//                     name="deliveryTime"
//                     checked={deliveryTime === slot}
//                     onChange={() => setDeliveryTime(slot)}
//                   />
//                   <span>
//                     {slot} - {`${parseInt(slot) + 2}`.padStart(2, '0')}:00
//                   </span>
//                 </label>
//               ))}
//             </div>
//             <button
//               className="mt-6 px-6 py-2 bg-orange-500 text-white rounded"
//               disabled={!deliveryDate || !deliveryTime}
//               onClick={proceedToPayment}
//             >
//               Proceed to payment
//             </button>
//           </div>
//         )}

//         {/* Step 4: Payment */}
//         {step === 4 && (
//           <form onSubmit={form.handleSubmit} className="space-y-4">
//             <h2 className="text-lg font-semibold mb-4">4. Payment</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block mb-1">Payment Method</label>
//                 <select
//                   value={paymentMethod}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="mpesa">M-Pesa</option>
//                   <option value="card">Card</option>
//                 </select>
//               </div>

//               {paymentMethod === 'mpesa' && (
//                 <form.Field name="phone_number">
//                   {(field) => (
//                     <div>
//                       <label className="block mb-1">Phone Number</label>
//                       <input
//                         type="text"
//                         value={field.state.value}
//                         onChange={(e) =>
//                           field.handleChange(() => e.target.value)
//                         }
//                         onBlur={field.handleBlur}
//                         className={`w-full p-2 border rounded ${
//                           field.state.meta.errors ? 'border-red-500' : ''
//                         }`}
//                       />
//                       {field.state.meta.errors && (
//                         <p className="text-red-500 text-sm">
//                           {field.state.meta.errors.join(', ')}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </form.Field>
//               )}

//               <button
//                 type="submit"
//                 disabled={form.state.isSubmitting}
//                 className="px-6 py-2 bg-orange-500 text-white rounded"
//               >
//                 {form.state.isSubmitting ? 'Processing...' : 'Place Order'}
//               </button>
//             </div>
//           </form>
//         )}
//         {/* <form onSubmit={form.handleSubmit} className="space-y-4">
//             <form.Field name="phone_number">
//               {(field) => (
//                 <div>
//                   <label>Phone</label>
//                   <input
//                     value={field.state.value}
//                     onChange={(e) => field.handleChange(() => e.target.value)}
//                     onBlur={field.handleBlur}
//                   />
//                   {field.state.meta.errors && (
//                     <p className="text-red-500 text-sm">
//                       {field.state.meta.errors.join(', ')}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </form.Field>

//             <button
//               type="submit"
//               disabled={form.state.isSubmitting}
//               className="px-4 py-2 bg-orange-500 text-white rounded"
//             >
//               Submit
//             </button>
//           </form> */}
//       </div>

//       {/* Order Summary (always visible) */}
//       <div className="w-96 ml-12">
//         <div className="p-6 bg-white rounded-lg shadow border mb-4">
//           <div className="mb-4 flex items-center">
//             {order?.products?.length ||
//               (0 > 0 &&
//                 order?.products.map(
//                   (product: any) =>
//                     product.product_image && (
//                       <img
//                         key={product.id}
//                         src={product.product_image}
//                         alt={product.title || 'Product'}
//                         className="w-12 h-12 mr-3 rounded"
//                       />
//                     ),
//                 ))}
//             <div>
//               <div className="font-medium">
//                 {order?.products?.[0]?.product_name || 'Products Title Here'}
//               </div>
//               <div className="flex items-center gap-3">
//                 <span className="text-orange-500 font-bold text-lg">
//                   KES{order?.total_amount || 15}
//                 </span>
//                 <span className="line-through text-gray-400">
//                   KES{order?.tax_amount || 18}
//                 </span>
//               </div>
//             </div>
//             <div className="flex justify-between text-gray-600 my-1">
//               <span>Grocer Jet</span>
//               <span>${order?.total_amount || 15}</span>
//             </div>
//             <div className="flex justify-between text-gray-600 my-1">
//               <span>Delivery Charges</span>
//               <span>KES 10</span>
//             </div>
//             <div className="flex justify-between text-gray-600 my-1">
//               <span>Tax</span>
//               <span>KES {order?.tax_amount || 3}</span>
//             </div>
//             <div className="flex justify-between font-bold text-lg mt-3 text-gray-800">
//               <span>Total</span>
//               <span>
//                 KES
//                 {(order?.total_amount ?? 0) + (order?.tax_amount ?? 0) + 10}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

