import {
  generateGeminiResponse,
  type TGeminiRequest,
  type TGeminiResponse,
} from '@/api/gemini'

// export const useGenerateGemini = () => {
//   return useMutation<TGeminiResponse, Error, TGeminiRequest>({
//     mutationKey: ['generate-gemini'],
//     mutationFn: (data) => generateGeminiResponse(data),
//     onSuccess: (data) => {
//       console.log('Gemini response generated successfully', data)
//     },
//   })
// }
import { useMutation } from '@tanstack/react-query'
// import { useAuth } from './UseAuth'

export const useGenerateGemini = () => {
  return useMutation<TGeminiResponse, Error, TGeminiRequest>({
    mutationKey: ['generate-gemini'],
    mutationFn: generateGeminiResponse,
    onSuccess: (data) => {
      if (!data.text) {
        console.warn('Received empty response from Gemini')
      } else {
        console.log('Gemini response generated successfully', data)
      }
    },
    onError: (error) => {
      console.error('Error generating Gemini response:', error)
    },
    retry: (failureCount, error) => {
      return error.message.includes('Failed to fetch') && failureCount < 2
    },
    retryDelay: 1000,
  })
}