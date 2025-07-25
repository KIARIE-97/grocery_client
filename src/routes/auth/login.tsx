import Footer from '@/components/bars/Footer'
import Login from '@/components/login'
import Navbar from '@/components/navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Navbar/>
    < Login/>
    <Footer/>
  </div>
}
