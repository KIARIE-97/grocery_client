
const url = 'http://localhost:8000'

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


export type TGeminiRequest = {
  prompt: string
}

export type TGeminiProduct = {
  id: number
  name: string
  imageUrl: string
}

export type TGeminiResponse = {
  text: string
  products?: TGeminiProduct[]
  metadata?: {
    isOrderRelated: boolean
    timestamp: string
  }
}
// export const generateGeminiResponse = async (
//   data: TGeminiRequest,
// ): Promise<TGeminiResponse> => {
//   const token = getToken()
//   const res = await fetch(`${url}/gemini/generate`, {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   })

//   await handleApiResponse(res)
//    const result = await res.json()

//    return {
//      output: result.response || result.output || 'No response found.',
//    }
// }
export const generateGeminiResponse = async (
  data: TGeminiRequest,
): Promise<TGeminiResponse> => {
  const authData = localStorage.getItem('auth')
  const isAuthenticated = !!authData
  let token: string | undefined

  if (isAuthenticated) {
    try {
      token = getToken()
    } catch (error) {
      token = undefined
    }
  }

  if (!data.prompt || data.prompt.trim().length < 1) {
    return {
      text: 'Please type your question about our products or services!',
      products: [],
    }
  }

  const endpoint =
    isAuthenticated && token
      ? `${url}/gemini/generate`
      : `${url}/gemini/generate/guest`

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (isAuthenticated && token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      throw new Error('Failed to get response from assistant')
    }

    const result = await res.json()
const normalizedResponse = result.response ? result.response : result

return {
  text:
    normalizedResponse.text ||
    normalizedResponse.output ||
    'I would be happy to help!.',
  products: normalizedResponse.products || [],
  metadata: normalizedResponse.metadata,
}
  } catch (error) {
    console.error('Gemini API error:', error)
    return {
      text: 'Our chat service is temporarily unavailable. Please try again later!',
      products: [],
    }
  }
}
