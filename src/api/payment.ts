const url = 'http://localhost:8000'

// Helper function to handle API responses and errors
const handleApiResponse = async (res: Response) => {
  let errorMessage = `Request failed with status ${res.status}: ${res.statusText}`
  if (!res.ok) {
    try {
      // Try parsing the JSON
      const contentType = res.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json()
        errorMessage = errorData.message || errorData.error || errorMessage
      } else {
        // If not JSON, try to read as text
        const errorText = await res.text()
        if (errorText) {
          errorMessage = errorText
        }
      }
    } catch (parseError) {
      // If parsing fails, use the default error message
      console.warn('Failed to parse error response:', parseError)
    }
    throw new Error(errorMessage)
  }
  return res
}
const getToken = () => {
  const Userdata = localStorage.getItem('auth')
  if (!Userdata) {
    throw new Error('No authentication data found')
  }
  const parsedData = JSON.parse(Userdata)
  if (!parsedData.token) {
    throw new Error('No token found in authentication data')
  }
  return parsedData.token
}
//create payment
export const createPayment = async (orderId: string, paymentData: any) => {
  const token = getToken()
  console.log(`Creating payment for order ${orderId} with token: ${token}`)
  console.log('Creating payment with:', orderId, paymentData)
  const res = await fetch(`${url}/payment/pay`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderId, ...paymentData }),
  })
  await handleApiResponse(res)
  const text = await res.text()
  if (!text) {
    // No response body, assume success
    return {}
  }
  try {
    console.log('Payment response:', text)
    return JSON.parse(text)
  } catch (error) {
    console.error('Failed to parse JSON response:', error)
    // Optionally, return empty object or throw error
    return {}
  }
}
//fetch all payments
export const getPayments = async () => {
  const token = getToken()
  const res = await fetch(`${url}/payment`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  await handleApiResponse(res)
  return res.json()
}

export const getPaymentsByUser = async (userId: number) => {
  const token = getToken()
  const res = await fetch(`${url}/payments/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) throw new Error('Failed to fetch payments')
  return res.json()
}