import Sidebar from '@/components/bars/SideBar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/driver')({
  component: RouteComponent,
})

function RouteComponent() {
   return (
     <div className="flex h-screen bg-gray-100">
       <Sidebar />
       <div className="flex flex-col flex-1">
         {/* <Navbar /> */}
         <main className="flex-1 overflow-y-auto p-6">
           {/* Main Content */}
           <div className="container mx-auto">
             <h1 className="text-2xl font-bold mb-4">Driver </h1>
           </div>
           <Outlet />
         </main>
       </div>
     </div>
   )
}
