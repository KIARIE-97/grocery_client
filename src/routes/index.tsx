import Footer from '@/components/bars/Footer'
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
    <>
      <Navbar />
      <div className="relative m-5 ">
        {/* Homepage Sections */}
        <CarouselPlugin />
        <HomeHighlights />
        <GrocerChat />
      </div>
      <Footer />
    </>
  )
}
