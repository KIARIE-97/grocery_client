import type { TEditUser, TUserData } from '@/types/user.types'

export const url = 'http://localhost:8000'

export const getToken = () => {
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

//helper function to handle api responses and errors
export const handleApiResponse = async (res: Response) => {
  let errorMessage = `request failed wit status ${res.status}: ${res.statusText}`
  if (!res.ok) {
    try {
      //try parsing the json
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
export const getCustomers = async () => {
  const token = getToken()
  console.log(`Fetching customers with token: ${token}`)
  const res = await fetch(`${url}/users/customers`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  await handleApiResponse(res)
  return res.json()
}
export const getCustomer = async (id: string) => {
  const token = getToken()
  const res = await fetch(`${url}/users/customers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  await handleApiResponse(res)
  return res.json()
}
export const getDrivers = async () => {
  const token = getToken()
  const res = await fetch(`${url}/drivers`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  await handleApiResponse(res)
 const data = await res.json()
 console.log('response from getDrivers:', data)
 return data;
}

export const getDriver = async (id: string) => {
  const token = getToken()
  const res = await fetch(`${url}/drivers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  await handleApiResponse(res)
  return res.json()
}
export const getStoreOwner = async () => {
  const token = getToken()
  console.log(`Fetching admins with token: ${token}`)
  const res = await fetch(`${url}/users/store_owners`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  await handleApiResponse(res)
  return res.json()
}
//create user
export const createUser = async (userData: TUserData) => {
  const token = getToken()
  const res = await fetch(`${url}/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
  await handleApiResponse(res)
  return res.json()
}
export const updateUser = async (id: string, userData: TEditUser) => {
  const token = getToken()
  const res = await fetch(`${url}/users/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
  await handleApiResponse(res)
  return res.json()
}
//all users
export const getUsers = async () => {
  // const token = getToken()
  const res = await fetch(`${url}/users`, {
    headers: {
      // Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  await handleApiResponse(res)
  console.log('response from getUsers:', res)
  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`)
  }
  return res.json()
}
//driver
export const assignOrderToDriver = async (
  orderId: string,
  driverId: number,
) => {
  const token = getToken()
  const res = await fetch(`${url}/orders/${orderId}/assign-driver/${driverId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }  })
  await handleApiResponse(res)
  return res.json()
}