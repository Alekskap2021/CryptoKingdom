import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/bybit/queries.ts";
import { fetchOpenOrders } from "../api/fetchOpenOrders.ts";

export const openOrdersQueryKey = (apiKeyId: string) => queryKeys.openOrders(apiKeyId);

interface UseQueryOpenOrdersParams {
 apiKeyId?: string;
}

export const useQueryOpenOrders = (params: UseQueryOpenOrdersParams) => {
 const { apiKeyId } = params;

 return useQuery({
  enabled: Boolean(apiKeyId),
  queryFn: () => fetchOpenOrders({ data: { apiKeyId: apiKeyId! } }),
  queryKey: openOrdersQueryKey(apiKeyId ?? ""),
  refetchInterval: 15_000,
 });
};
