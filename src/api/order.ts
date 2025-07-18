import type { TCartOrder, TOrder } from "@/types/order.types"

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
  return res;
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
//fetch all orders
export const getOrders = async () => {
  const token = getToken()
  console.log(`Fetching orders with token: ${token}`)
  const res = await fetch(`${url}/orders`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  await handleApiResponse(res)
  return res.json()
}


//fetch order by id
export const getOrder = async (id: string) => {
    const res = await fetch(`${url}/orders/${parseInt(id)}`)
    await handleApiResponse(res)
return res.json();
 
}
//create order
export const createOrder = async (orderData: TCartOrder): Promise<TCartOrder> => {
    const res = await fetch(`${url}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
    await handleApiResponse(res)
    return res.json();
}

export async function updateOrderStatus(orderId: string, status: string) {
 console.log(`Updating order ${orderId} status to ${status}`)
  const token = getToken()
  const response = await fetch(`${url}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: status.toLocaleLowerCase() }),
  })

  // if (!response.ok) {
  //   throw new Error('Failed to update status')
  // }
  const newStatus = await response.json()
  console.log('new status:', newStatus)
  return newStatus
}

//update order
export const updateOrder = async ({id , orderData}: any): Promise<TOrder> => {
    const numberId = parseInt(id)
    if (isNaN(numberId)) {
      throw new Error(`invalid orderid: ${id}`)
    }
    const res = await fetch(`${url}/orders/${numberId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
    await handleApiResponse(res)

    return res.json();
}
//delete order
export const deleteOrder = async (id: string) => {
    const numberId = parseInt(id)
    if (isNaN(numberId)) {
        throw new Error(`invalid orderid: ${id}`)
      }
    const res = await fetch(`${url}/orders/${numberId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    await handleApiResponse(res)
    return res.json();
}
