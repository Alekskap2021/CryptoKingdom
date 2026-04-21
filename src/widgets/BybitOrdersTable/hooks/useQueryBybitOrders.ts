import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/bybit";
import { fetchBybitOrders } from "../api/fetchBybitOrders.ts";

export const bybitOrdersQueryKey = (apiKeyId: string) => queryKeys.openOrders(apiKeyId);

interface UseQueryBybitOrdersParams {
 apiKeyId?: string;
}

export const useQueryBybitOrders = (params: UseQueryBybitOrdersParams) => {
 const { apiKeyId } = params;

 return useQuery({
  enabled: Boolean(apiKeyId),
  queryFn: () => fetchBybitOrders({ data: { apiKeyId: apiKeyId! } }),
  queryKey: bybitOrdersQueryKey(apiKeyId ?? ""),
  refetchInterval: 10_000,
 });
};
