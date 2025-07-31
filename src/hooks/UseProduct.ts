import { createProduct, deleteProduct, getProduct, getProducts, getProductsByStore, updateProduct } from "@/api/product";
import type { SProduct, TProduct, TProductForm } from "@/types/product.types";
import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";

export const useProduct = (): UseQueryResult => {
    return useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
    })
}
export const useSingleProduct = (
  productId: string,
): UseQueryResult<SProduct, Error> => {
  return useQuery({
    queryKey: ['products', productId],
    queryFn: () => getProduct(productId),
    enabled: !!productId,
  })
}
export const useProductsByStore = (storeId: number): UseQueryResult<TProduct[], Error> => {
    return useQuery({
        queryKey: ['products', 'store', storeId],
        queryFn: () => getProductsByStore(storeId),
        enabled: !!storeId,
    })
}
export const useCreateProduct = () => {
    const queryClient = useQueryClient()
    return useMutation<TProductForm, Error, TProductForm>({
      mutationKey: ['createproduct'],
      mutationFn: (productData) => createProduct(productData),
      onSuccess: (data) => {
          console.log('Product created successfully', data)
        queryClient.invalidateQueries({ queryKey: ['products'], exact: true })
      },
    })
}
export const useUpdateProduct = (): UseMutationResult<TProduct, Error, { id: string; productData: TProduct }> => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['updateproduct'],
        mutationFn: ({ id, productData }) => updateProduct(id, productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'], exact: true })
        },
    })
}
export const useDeleteProduct = (): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['deleteproduct'],
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'], exact: true })
        },
    })
}