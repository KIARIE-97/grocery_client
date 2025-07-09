import type { TStore, TStoreForm } from "@/types/store.types"

const url = 'http://localhost:8000'

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
//fetch all stores
export const getStore = async () => {
  const token = getToken()
  const res = await fetch(`${url}/stores`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  await handleApiResponse(res)
  return res.json()
}
//fetch a single store by ID
export const getStoreById = async (id: string) => {
    const token = getToken()
    const res = await fetch(`${url}/stores/${id}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        },
    })
    await handleApiResponse(res)
    return res.json()
    }
//create a new store
export const createStore = async (storeData: TStoreForm): Promise<TStoreForm> => {
  const token = getToken()
  const res = await fetch(`${url}/stores`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storeData),
  })
  await handleApiResponse(res)
  return res.json()
}
//update a store by ID
export const updateStore = async (id: string, storeData:  any) => {
  const token = getToken()
  const res = await fetch(`${url}/stores/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storeData),
  })
  await handleApiResponse(res)
  return res.json()
}
//delete a store by ID
export const deleteStore = async (id: string) => {
  const token = getToken()
  const res = await fetch(`${url}/stores/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    })
    await handleApiResponse(res)
    if (!res.ok) {
      throw new Error(`Failed to delete store with ID ${id}`)
    }
    return res.json()
}

