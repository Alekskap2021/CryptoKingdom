import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/bybit/queries.ts";
import { fetchBalance } from "../api/fetchUserBalance";

const userBalanceQueryKey = (apiKeyId: string) => queryKeys.balance(apiKeyId);

interface UseQueryUserBalanceParams {
 apiKeyId?: string;
}

export const useQueryUserBalance = (params: UseQueryUserBalanceParams) => {
 const { apiKeyId } = params;

 return useQuery({
  enabled: Boolean(apiKeyId),
  queryFn: () => fetchBalance({ data: { apiKeyId: apiKeyId! } }),
  queryKey: userBalanceQueryKey(apiKeyId ?? ""),
  refetchInterval: 30_000,
 });
};
