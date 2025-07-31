import Footer from '@/components/bars/Footer'
import Navbar from '@/components/navbar'
import Products from '@/components/Products'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/product/$categoryId')({
  component: RouteComponent,
})
function RouteComponent() {
  return (
    <>
        <Navbar />
    <div className="flex  bg-gray-100">
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto p-6">
          
            <Products />
        </main>
      </div>
    </div>
        <Footer />
        </>
  )
}

