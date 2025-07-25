// src/hooks/useAuth.ts
import { useStore } from '@tanstack/react-store'
import { authActions, authStore } from '@/store/authStore'

export const useAuth = () => {
  const isAuthenticated = useStore(authStore, (state) => state.isAuthenticated)
  const user = useStore(authStore, (state) => state.user) 
 return {
   isAuthenticated,
   user,
   setUser: (newUser: typeof user & { token?: string; driver?: any }) => {
     authActions.setUser(newUser, newUser?.token ?? '', newUser?.driver ?? null)
   },
 }
}
