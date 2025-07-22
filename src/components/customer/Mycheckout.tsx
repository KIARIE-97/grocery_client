import React, { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useOrder, useUpdateOrder, type OStatus } from '@/hooks/useOrder'
import { useCreatePayment } from '@/hooks/usePayment'
import { useUserLocations } from '@/hooks/useLocation'
import { useSearch } from '@tanstack/react-router'

type CheckoutProps = {
  orderId: string
  onPaymentSuccess?: (payment: any) => void
}

type DeliveryTimeSlot = {
  id: string
  label: string
  startTime: string
  endTime: string
}

const Checkout: React.FC<CheckoutProps> = ({ onPaymentSuccess }) => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  )
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] =
    useState<DeliveryTimeSlot | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cash'>('mpesa')
  const [phoneNumber, setPhoneNumber] = useState('')

  interface SearchParams {
    orderId?: string;
  }
  const search = useSearch({ from: '/customer/checkout' })

    const orderId = (search as SearchParams).orderId?.replace(/"/g, '')
      // console.log('orderId:', orderId)
  // Hooks
  const { data: order, isLoading: orderLoading } = useOrder(orderId)
  const { data: userLocations = [], isLoading: locationsLoading } =
    useUserLocations()
  const updateOrder = useUpdateOrder()
  const createPayment = useCreatePayment()

  // Form handling
  const form = useForm({
    defaultValues: {
      phoneNumber: '',
    },
    onSubmit: async ({ value }) => {
      if (currentStep === 3) {
        // Changed from 4 to 3 since we removed a step
        // Handle payment submission
        if (paymentMethod === 'mpesa' && !value.phoneNumber) {
          alert('Please enter your phone number for M-Pesa payment')
          return
        }

        try {
          // First update the order with delivery details if needed
          if (selectedDate && selectedTimeSlot) {
            const deliveryDateTime = new Date(selectedDate)
            const [startHour] = selectedTimeSlot.startTime.split(':')
            deliveryDateTime.setHours(parseInt(startHour, 10))

            updateOrder.mutate({
              order_id: orderId,
              delivery_schedule_at: deliveryDateTime.toISOString(),
            })
          }

          // Then process payment
          if (paymentMethod === 'mpesa') {
            await createPayment.mutateAsync(
              {
                orderId,
                phone_number: value.phoneNumber,
                amount: order?.total_amount || 0,
                paymentMethod: 'mpesa',
              },
              {
                onSuccess: (payment) => {
                  onPaymentSuccess?.(payment)
                },
              },
            )
          } else {
            // For cash on delivery, just update order status
            await updateOrderStatus.mutateAsync({
              orderId,
              status: 'pending' as OStatus,
            })
            onPaymentSuccess?.({ method: 'cash' })
          }
        } catch (error) {
          console.error('Checkout error:', error)
        }
      } else {
        setCurrentStep(currentStep + 1)
      }
    },
  })

  // Delivery time slots
  const timeSlots: DeliveryTimeSlot[] = [
    {
      id: '1',
      label: '8.00AM - 10.00AM',
      startTime: '08:00',
      endTime: '10:00',
    },
    {
      id: '2',
      label: '10.00AM - 12.00PM',
      startTime: '10:00',
      endTime: '12:00',
    },
    {
      id: '3',
      label: '12.00PM - 2.00PM',
      startTime: '12:00',
      endTime: '14:00',
    },
    { id: '4', label: '2.00PM - 4.00PM', startTime: '14:00', endTime: '16:00' },
    { id: '5', label: '4.00PM - 6.00PM', startTime: '16:00', endTime: '18:00' },
  ]

  // Generate dates for delivery selection (next 7 days)
  const generateDeliveryDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }

    return dates
  }

  const deliveryDates = generateDeliveryDates()

  // Calculate order totals
  const subtotal =
    order?.products?.reduce(
      (sum, product) => sum + (product.product_price || 0),
      0,
    ) || 0
  const taxAmount = order?.tax_amount || 0
  const deliveryFee = order?.delivery_fee || 0
  const discountAmount = order?.discount_amount || 0
  const total = subtotal + taxAmount + deliveryFee - discountAmount

  if (orderLoading || locationsLoading) {
    return <div className="p-4">Loading checkout details...</div>
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 max-w-6xl mx-auto">
      {/* Checkout Steps */}
      <div className="md:w-2/3">
        <h1 className="text-2xl font-bold mb-6 text-orange-600">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 relative">
          {[1, 2, 3].map(
            (
              step, // Reduced from 4 to 3 steps
            ) => (
              <React.Fragment key={step}>
                <div
                  className={`flex flex-col items-center z-10 ${currentStep >= step ? 'text-orange-600' : 'text-gray-400'}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}
                  >
                    {step}
                  </div>
                  <span className="text-sm mt-2">
                    {step === 1 && 'Delivery Address'}
                    {step === 2 && 'Delivery Time'}
                    {step === 3 && 'Payment'}
                  </span>
                </div>
                {step < 3 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${currentStep > step ? 'bg-orange-600' : 'bg-gray-200'}`}
                  ></div>
                )}
              </React.Fragment>
            ),
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          {/* Step 1: Delivery Address */}
          {currentStep === 1 && (
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">
                1. Delivery Address
              </h2>
              <div className="space-y-3">
                {userLocations.map((location) => (
                  <div
                    key={location.id}
                    className={`p-4 border rounded-md cursor-pointer ${selectedAddressId === location.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                    onClick={() => setSelectedAddressId(location.id)}
                  >
                    <h3 className="font-medium">{location.name}</h3>
                    <p className="text-sm text-gray-600">
                      {location.address_line1}
                    </p>
                    <p className="text-sm text-gray-600">
                      {location.address_line2}
                    </p>
                    <p className="text-sm text-gray-600">
                      {location.city}, {location.country}
                    </p>
                  </div>
                ))}
              </div>
              {selectedAddressId && (
                <div className="mt-4 p-3 bg-green-50 text-green-800 text-sm rounded-md">
                  Selected address will be used for delivery
                </div>
              )}
            </div>
          )}

          {/* Step 2: Delivery Time & Date */}
          {currentStep === 2 && (
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">
                2. Delivery Time & Date
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date*
                </label>
                <div className="flex overflow-x-auto gap-2 pb-2">
                  {deliveryDates.map((date) => {
                    const dateString = date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })
                    const isSelected =
                      selectedDate &&
                      date.toDateString() === selectedDate.toDateString()

                    return (
                      <button
                        key={date.toString()}
                        type="button"
                        className={`px-4 py-2 rounded-md whitespace-nowrap ${isSelected ? 'bg-orange-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        {dateString}
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time Slot*
                  </label>
                  <div className="space-y-2">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`p-3 border rounded-md cursor-pointer ${selectedTimeSlot?.id === slot.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}
                        onClick={() => setSelectedTimeSlot(slot)}
                      >
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            checked={selectedTimeSlot?.id === slot.id}
                            onChange={() => {}}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                          />
                          <span>{slot.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">3. Payment</h2>
              <div className="space-y-4">
                <div
                  className={`p-4 border rounded-md cursor-pointer ${paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="font-medium">Cash on Delivery</span>
                  </label>
                </div>

                <div
                  className={`p-4 border rounded-md cursor-pointer ${paymentMethod === 'mpesa' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                  onClick={() => setPaymentMethod('mpesa')}
                >
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={paymentMethod === 'mpesa'}
                      onChange={() => setPaymentMethod('mpesa')}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="font-medium">M-Pesa</span>
                  </label>

                  {paymentMethod === 'mpesa' && (
                    <div className="mt-3 pl-7">
                      <form.Field
                        name="phoneNumber"
                        children={(field) => (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number*
                            </label>
                            <input
                              name={field.name}
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="e.g. 2547xxxxxxx"
                              className="w-full p-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              You'll receive an M-Pesa prompt on this number
                            </p>
                          </div>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="submit"
              className={`px-6 py-2 rounded-md text-white ${currentStep === 3 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'}`}
              disabled={
                (currentStep === 1 && !selectedAddressId) ||
                (currentStep === 2 && (!selectedDate || !selectedTimeSlot)) ||
                (currentStep === 3 &&
                  paymentMethod === 'mpesa' &&
                  !form.state.values.phoneNumber)
              }
            >
              {currentStep === 3 ? 'Place Order' : 'Proceed'}
            </button>
          </div>
        </form>
      </div>
      {/* Order Summary */}
      <div className="md:w-1/3">
        <div className="border rounded-lg p-6 sticky top-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-2 mb-4">
            {order?.products?.map((product) => (
              <div key={product.id} className="flex justify-between">
                <span className="text-gray-700">{product.product_name}</span>
                <span className="font-medium">
                  ${product.product_price?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
              <span className="text-gray-800">Total</span>
              <span className="text-orange-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            Secure checkout
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
