import { CarouselPlugin } from '@/components/carousel'
import { GrocerChat } from '@/components/Gemini'
import HomeHighlights from '@/components/homeItem'
import Navbar from '@/components/navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="relative">
      {/* Homepage Sections */}
      <Navbar />
      <CarouselPlugin />
      <HomeHighlights />
      <GrocerChat />
    </div>
  )
}
