import type { IAuthState } from '@/types/user.types'
import { Store } from '@tanstack/react-store'
import { toast } from 'sonner'

export const authStore = new Store<IAuthState>({
  user: null,
  token: null,
  isAuthenticated: false,
})
//set user
export const authActions = {
  setUser: (User: IAuthState['user'], Token: string) => {
    authStore.setState({
      user: User,
      token: Token,
      isAuthenticated: true,
    })
    localStorage.setItem('auth', JSON.stringify({ user: User, token: Token }))
  },

  removeUser: () => {
    authStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
    localStorage.removeItem('auth')
  },
  initAuth: () => {
    const authData = localStorage.getItem('auth')
    if (authData) {
      try {
        const { user, token } = JSON.parse(authData)
        console.log('Parsed user:', user)
        authStore.setState({
          user: user,
          token: token,
          isAuthenticated: true,
        })
      } catch (e) {
        localStorage.removeItem('auth')
        toast.error('Failed to parse authentication data. Please log in again.')
      }
    }
  },
}
