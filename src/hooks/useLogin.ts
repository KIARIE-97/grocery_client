import { LoginUser, RegisterUser } from '@/api/auth'
import { authActions } from '@/store/authStore'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'

export const useLoginUser = (): UseMutationResult<
  any,
  Error,
  { email: string; password: string; otp: string },
  unknown
> => {
  return useMutation<
    any,
    Error,
    { email: string; password: string; otp: string },
    unknown
  >({
    mutationFn: ({
      email,
      password,
      otp,
    }: {
      email: string
      password: string
      otp: string
    }) => LoginUser(email, password, otp),
    onSuccess: (data) => {
      authActions.setUser(data.founduser, data.accessToken)
    },
    onError: (error) => {
      console.error(error)
    },
  })
}

export const useRegisterUser = (): UseMutationResult<any, Error, { email: string; password: string; full_name: string; phone_number: string; }, unknown> => {
  return useMutation<
    any,
    Error,
    {
      email: string
      password: string
      full_name: string
      phone_number: string
    },
    unknown
  >({
    mutationFn: ({
      email,
      password,
      full_name,
      phone_number,
    }: {
      email: string
      password: string
      full_name: string
      phone_number: string
    }) => RegisterUser(email, password, full_name, phone_number),
    onSuccess: (data) => {
      authActions.setUser(data.founduser, data.accessToken)
    },
    onError: (error) => {
      console.error(error)
    },
  })
}

export const useLogoutUser = (): UseMutationResult<any, Error, void, unknown> => {
  return useMutation<any, Error, void, unknown>({
    mutationFn: () => {
      return new Promise((resolve) => {
        authActions.removeUser()
        resolve({ message: 'Logged out successfully' })
      })
    },
    onSuccess: (data) => {
      console.log(data.message)
    },
    onError: (error) => {
      console.error(error)
    },
  })
}