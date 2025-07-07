import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { authActions } from '@/store/authStore.ts'

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
      <Header />

      <Outlet />
      <TanStackRouterDevtools />

      <TanStackQueryLayout />
    </>
  )
}
