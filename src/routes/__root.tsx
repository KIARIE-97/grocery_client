import { Outlet, createRootRouteWithContext, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { authActions, authStore } from '@/store/authStore.ts'
import { Toaster } from 'sonner'
import { CartProvider } from '@/store/cartStore.tsx'
import Navbar from '@/components/navbar.tsx'
import CartSidebar from '@/components/CartSidebar.tsx'
import { useStore } from '@tanstack/react-store'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: main,
})

function main () {
    const isSignedIn = useStore(authStore, (state) => state.isAuthenticated)
    const router = useRouter()
    const location = router.state.location.pathname
  useEffect(() => {
    authActions.initAuth()
  }, [])
  const [showCart, setShowCart] = useState(false)
  const showNavbar = !isSignedIn || (isSignedIn && location === '/')
    const isDashboard = location.startsWith('/dashboard')

  return (
    <>
      <Toaster
        theme="light"
        position="top-right"
        richColors={true}
        className="!rounded-lg !shadow-lg !bg-white !text-gray-900"
      />
     
      {/* {showNavbar && <Navbar onCartClick={() => setShowCart((v) => !v)} />} */}
      {/* {isSignedIn &&
        location === '/' &&(<Navbar onCartClick={() => setShowCart((v) => !v)} />)} */}
      {showCart && <CartSidebar onClose={() => setShowCart(false)} />}
      <Outlet />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  )
}
