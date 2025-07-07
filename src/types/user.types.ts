export type TUserData = {
  id: string
  full_name: string
  email: string
  password: string
  phone_number: string
  profile_url: string
  is_active: boolean;
  role: 'customer' | 'store_owner' | 'driver' | 'admin'
}

export interface IAuth {
  email: string
  password: string
}

export interface IAuthState {
  user: TUserData | null
  token: string | null
  isAuthenticated: boolean
}