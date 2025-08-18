import type { TCategory } from "@/types/category.types"
import { url } from "./utils"


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
// Fetch all categories
export const getCategories = async () => {
    // const token = getToken()
    const res = await fetch(`${url}/category`, {
      headers: {
        // Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    await handleApiResponse(res)
    return res.json()
    }
// Fetch a single category by ID
export const getCategory = async (id: string) => {
    // const token = getToken()
    const res = await fetch(`${url}/category/${id}`, {
        headers: {
            // Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    await handleApiResponse(res)
    return res.json()
}
// Create a new category
export const createCategory = async (categoryData:TCategory): Promise<TCategory> => {
    const token = getToken()
    console.log('Creating category with data:', categoryData)
    const res = await fetch(`${url}/category`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    })
    console.log(
      'first'
    )
    console.log('res:', res)
    await handleApiResponse(res)
    return res.json()
}   
// Update an existing category
export const updateCategory = async (id: string, categoryData: any) => {
    const token = getToken()
    const res = await fetch(`${url}/category/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    })
    await handleApiResponse(res)
    return res.json()
} 
// Delete a category
export const deleteCategory = async (id: string) => {
    const token = getToken()
    const res = await fetch(`${url}/category/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    await handleApiResponse(res)
    return res.json()
}

