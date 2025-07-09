import { getCustomers, getDrivers, getStoreOwner } from "@/api/user";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";


export const useCustomer = (): UseQueryResult => {
    return useQuery({
        queryKey: ['customers'],
        queryFn: getCustomers,
    });
    }
export const useDrivers = (): UseQueryResult => {
    return useQuery({
        queryKey: ['drivers'],
        queryFn: () => getDrivers(),
    });
}
export const useStoreOwners = (): UseQueryResult => {
    return useQuery({
        queryKey: ['store_owners'],
        queryFn: () => getStoreOwner(),
    });
}
