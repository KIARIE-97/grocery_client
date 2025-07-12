import type { TProductForm } from "@/types/product.types"

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
//fetch all orders
export const getProducts = async () => {
  const token = getToken()
  const res = await fetch(`${url}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  await handleApiResponse(res)
  return res.json()
}
//fetch a single product
export const getProduct = async (id: string) => {
  const token = getToken()
  const res = await fetch(`${url}/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  await handleApiResponse(res)
  return res.json()
}
//fetch products by store
export const getProductsByStore = async (storeId: number) => {
  const token = getToken()
  const res = await fetch(`${url}/products/store/${storeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  await handleApiResponse(res)
  return res.json()
}
//create a product
export const createProduct = async (productData: TProductForm): Promise<TProductForm> => {
  const token = getToken()
  const res = await fetch(`${url}/products`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })
  await handleApiResponse(res)
  return res.json()
}
//update a product
export const updateProduct = async (id: string, productData: any) => {
  const token = getToken()
  const res = await fetch(`${url}/products/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })
  await handleApiResponse(res)
  return res.json()
}
//delete a product
export const deleteProduct = async (id: string) => {
  const token = getToken()
  const res = await fetch(`${url}/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },  
  })
  await handleApiResponse(res)
  return res.json()
}