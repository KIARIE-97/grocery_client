import { handleApiResponse } from "./user"

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

export type TGeminiResponse = {
  output: string
}

export const generateGeminiResponse = async (
  data: TGeminiRequest,
): Promise<TGeminiResponse> => {
  const token = getToken()
  const res = await fetch(`${url}/gemini/generate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  await handleApiResponse(res)
   const result = await res.json()

   return {
     output: result.response || result.output || 'No response found.',
   }
}
