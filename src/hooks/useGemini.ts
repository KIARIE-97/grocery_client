import { generateGeminiResponse, type TGeminiRequest, type TGeminiResponse } from "@/api/gemini"
import { useMutation } from "@tanstack/react-query"

export const useGenerateGemini = () => {
  return useMutation<TGeminiResponse, Error, TGeminiRequest>({
    mutationKey: ['generate-gemini'],
    mutationFn: (data) => generateGeminiResponse(data),
    onSuccess: (data) => {
      console.log('Gemini response generated successfully', data)
    },
  })
}
