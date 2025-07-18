// components/GrocerChat.tsx
import { useState } from 'react'
import { X, MessageSquareText } from 'lucide-react'
import { useGenerateGemini } from '@/hooks/useGemini'

const prompts = [
  'Any new items similar to what I like?',
  'Snacks under 150 calories?',
  'Do you have oat milk?',
]

export const GrocerChat = () => {
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const { mutate: generate, data, status } = useGenerateGemini()
  const [chatHistory, setChatHistory] = useState<
    { role: 'user' | 'assistant'; message: string }[]
  >([])

  const handlePrompt = (text: string) => {
    setPrompt(text)
    generate({ prompt: text })
  }

 const handleSubmit = (e: React.FormEvent) => {
   e.preventDefault()
   if (!prompt.trim()) return

   const userMessage = prompt.trim()

   // Add user message
   setChatHistory((prev) => [...prev, { role: 'user', message: userMessage }])

   generate(
     { prompt: userMessage },
     {
       onSuccess: (data) => {
         setChatHistory((prev) => [
           ...prev,
           {
             role: 'assistant',
             message: data.output || 'No response',
           },
         ])
       },
     },
   )

   setPrompt('') // Clear input
 }


  return (
    <>
      {/* Floating Chat Bubble */}
      <button
        className="fixed bottom-4 right-4 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700"
        onClick={() => setOpen(!open)}
        aria-label="Open GrocerChat"
      >
        <MessageSquareText className="w-16 h-6" />
      </button>

      {/* Chat Modal */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-80 bg-white border rounded-2xl shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 flex justify-between items-center">
            <h2 className="font-semibold">GrocerChat</h2>
            <button
              onClick={() => setOpen(false)}
              className="hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
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
      <div
        key={idx}
        className={`flex ${
          item.role === 'user' ? 'justify-end' : 'justify-start'
        }`}
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
    ))
  )}


            {status === 'pending' && (
              <div className="text-gray-400 text-sm">Thinking...</div>
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
            />
            <button
              type="submit"
              disabled={status === 'pending'}
              className="bg-green-600 text-white px-3 py-1.5 rounded-full text-sm hover:bg-green-700"
            >
              {status === 'pending' ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  )
}
