import  Footer from '@/components/bars/Footer'
import ContactUs from '@/components/ContactUs'
import Navbar from '@/components/navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Navbar />
    <ContactUs />
    <Footer />
  </div>
}
