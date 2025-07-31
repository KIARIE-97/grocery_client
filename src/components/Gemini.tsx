import { useState } from 'react'
import { X, MessageSquareText } from 'lucide-react'
import { useGenerateGemini } from '@/hooks/useGemini'
import type { TGeminiResponse } from '@/api/gemini'

const prompts = [
  'Any new items similar to what I like?',
  'Snacks under 150 calories?',
  'Do you have oat milk?',
]

// Helper function to clean the response text
const cleanResponse = (text: string) => {
  if (typeof text !== 'string') return ''
  // Remove asterisks and other markdown-like formatting
  return text.replace(/\*\*/g, '').replace(/\*/g, '').trim()
}

export const GrocerChat = () => {
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const { mutate: generate, status } = useGenerateGemini()
  const [chatHistory, setChatHistory] = useState<
    {
      role: 'user' | 'assistant'
      message: string
      products?: TGeminiResponse['products']
    }[]
  >([])

  const handlePrompt = (text: string) => {
    const userMessage = text.trim()
    if (!userMessage) return

    setChatHistory((prev) => [...prev, { role: 'user', message: userMessage }])

    generate(
      { prompt: userMessage },
      {
        onSuccess: (data) => {
          // Handle both nested and flat products array
          const products = data.products?.length
            ? data.products
            : (data as any)?.response?.products || []

          setChatHistory((prev) => [
            ...prev,
            {
              role: 'assistant',
              message: cleanResponse(
                data.text || (data as any)?.response?.text || '',
              ),
              products: products,
            },
          ])
        },
        onError: () => {
          setChatHistory((prev) => [
            ...prev,
            {
              role: 'assistant',
              message:
                "Oops! I'm having trouble responding right now. Please try again in a moment.",
            },
          ])
        },
      },
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const userMessage = prompt.trim()

    if (!userMessage) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          message:
            "I'd love to help! What would you like to know about our products?",
        },
      ])
      return
    }

    setChatHistory((prev) => [...prev, { role: 'user', message: userMessage }])

    generate(
      { prompt: userMessage },
      {
        onSuccess: (data) => {
          setChatHistory((prev) => [
            ...prev,
            {
              role: 'assistant',
              message: cleanResponse(data.text),
              products: data.products,
            },
          ])
        },
        onError: () => {
          setChatHistory((prev) => [
            ...prev,
            {
              role: 'assistant',
              message:
                "Oops! I'm having trouble responding right now. Please try again in a moment.",
            },
          ])
        },
      },
    )

    setPrompt('')
  }

  return (
    <>
      {/* Floating Chat Bubble */}
      <button
        className="fixed bottom-4 w-20 right-4 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700"
        onClick={() => setOpen(!open)}
        aria-label="Open GrocerChat"
      >
        <MessageSquareText className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-80 bg-white border rounded-2xl shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 flex justify-between items-center">
            <h2 className="font-semibold">GrocerGenie</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setChatHistory([])}
                className="text-xs hover:text-gray-300"
                title="Clear conversation"
              >
                Clear
              </button>
              <button
                onClick={() => setOpen(false)}
                className="hover:text-gray-300"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-3 space-y-2 text-sm max-h-60 overflow-y-auto">
            {chatHistory.length === 0 ? (
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">Try one of these:</p>
                <div className="flex flex-wrap gap-2">
                  {prompts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handlePrompt(p)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-3 py-2 rounded-full transition"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              chatHistory.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div
                    className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-xl shadow ${
                        item.role === 'user'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.message}
                    </div>
                  </div>
                  {item.role === 'assistant' &&
                    item.products &&
                    item.products.length > 0 && 
                    (
                      <div className="flex flex-wrap gap-2 pl-2">
                        {item.products.map((product) => (
                          <div
                            key={product.id}
                            className="bg-white border rounded-lg p-2 shadow-sm w-full max-w-[180px]"
                          >
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-24 object-cover rounded-md mb-1"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src =
                                  '/placeholder-product.png'
                              }}
                            />
                            <p className="text-xs font-medium truncate">
                              {product.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))
            )}

            {status === 'pending' && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl shadow">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t p-2 flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none"
              placeholder="Type your question..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={status === 'pending'}
            />
            <button
              type="submit"
              disabled={status === 'pending' || !prompt.trim()}
              className="bg-green-600 text-white px-3 py-1.5 rounded-full text-sm hover:bg-green-700 disabled:bg-gray-400"
            >
              {status === 'pending' ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  )
}
