import { createCategory, getCategories, getCategory, updateCategory } from "@/api/category"
import type { TCategory } from "@/types/category.types"
import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query"

export const useCategories = (): UseQueryResult => {
  return useQuery({
    queryKey: ['Categories'],
    queryFn: getCategories,
  })
}
export const useCategory = (id: string): UseQueryResult => {
  return useQuery({
    queryKey: ['Categories', id],
    queryFn: () => getCategory(id),
    enabled: !!id,
  })
}
export const useUpdateCategory = (): UseMutationResult<TCategory, Error, { id: string; categoryData: TCategory }> => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: ['updateCategory'],
      mutationFn: ({ id, categoryData }) => updateCategory(id, categoryData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'], exact: true })
      },
    })
}
export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation<TCategory, Error, TCategory>({
    mutationKey: ['createCategory'],
    mutationFn: (categoryData) => createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Categories'], exact: true })
    },
  })
}
export const useDeleteCategory = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['deleteCategory'],
    mutationFn: (id) => updateCategory(id, { id, category_name: '' }), // Assuming you want to delete by updating
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Categories'], exact: true })
    },
  })
}