import { LoginUser, RegisterUser } from '@/api/auth'
import { authActions } from '@/store/authStore'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'

export const useLoginUser = (): UseMutationResult<
  any,
  Error,
  { email: string; password: string },
  unknown
> => {
  return useMutation<any, Error, { email: string; password: string }, unknown>({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      LoginUser(email, password),
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