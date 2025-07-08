import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { authActions } from '@/store/authStore.ts'
import { Toaster } from 'sonner'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: main,
})
function main () {
  useEffect(() => {
    authActions.initAuth()
  }, [])
  return (
    <>
      <Toaster
      theme="light"
      position="top-right"
      richColors={true}
      className="!rounded-lg !shadow-lg !bg-white !text-gray-900"
      />

      <Header />

      <Outlet />
      <TanStackRouterDevtools />

      <TanStackQueryLayout />
    </>
  )
}
