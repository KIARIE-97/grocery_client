import { createLocation, getUserLocations } from "@/api/location"
import type { TLocation } from "@/types/location.types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCreateLocation = () => {
  const queryClient = useQueryClient()

  return useMutation<TLocation, Error, TLocation>({
    mutationKey: ['create-location'],
    mutationFn: (locationData) => createLocation(locationData),
    onSuccess: (data) => {
      console.log('Location created successfully', data)
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    },
  })
}
export const useUserLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: () => getUserLocations(),
  })
}
