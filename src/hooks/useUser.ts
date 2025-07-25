import { createUser, getCustomer, getCustomers, getDriver, getDrivers, getStoreOwner, getUsers, updateUser } from "@/api/user";
import type { TDriver, TEditUser, TUserData } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";


//all users
export const useUsers = (): UseQueryResult => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}


export const useCustomer = (): UseQueryResult => {
    return useQuery({
        queryKey: ['customers'],
        queryFn: getCustomers,
    });
    }
export const useSingleCustomer = (id: string): UseQueryResult => {
    return useQuery({
        queryKey: ['customer', id],
        queryFn: () => getCustomer(id),
    });
}    
export const useDrivers = (): UseQueryResult => {
    return useQuery({
        queryKey: ['drivers'],
        queryFn: () => getDrivers(),
    });
}
export const useSingleDriver = (id: string) => {
  return useQuery<TDriver>({
    queryKey: ['driver', id],
    queryFn: () => getDriver(id),
  })
}
export const useStoreOwners = (): UseQueryResult => {
    return useQuery({
        queryKey: ['store_owners'],
        queryFn: () => getStoreOwner(),
    });
}
export const UseCreateUser = () => {
    const queryClient = useQueryClient()
    return useMutation<TUserData, Error, TUserData>({
     mutationKey: ['createuser'],
           mutationFn: (userData) => createUser(userData),
           onSuccess: (data) => {
               console.log('Product created successfully', data)
             queryClient.invalidateQueries({ queryKey: ['products'], exact: true })
           },
    })
}
export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateuser'],
    mutationFn: ({ id, userData }: { id: string; userData: TEditUser }) => updateUser(id, userData),
    onSuccess: (data) => {
      console.log('User updated successfully', data)
      queryClient.invalidateQueries({ queryKey: ['users'], exact: true })
    },
  })
}
