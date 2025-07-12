import { CarouselPlugin } from '@/components/carousel'
import HomeHighlights from '@/components/homeItem'
import Navbar from '@/components/navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div>
      {/* Homepage Sections */}
      <CarouselPlugin/>
      <HomeHighlights />
    </div>
  )
}
