import { useQuery } from "@tanstack/react-query";
import { fetchTotalEquity } from "../api/fetchTotalEquity.ts";

export const totalEquityQueryKey = (apiKeyId: string) => ["totalEquity", apiKeyId] as const;

interface UseQueryTotalEquityParams {
 apiKeyId?: string;
}

export const useQueryTotalEquity = (params: UseQueryTotalEquityParams) => {
 const { apiKeyId } = params;

 return useQuery({
  enabled: Boolean(apiKeyId),
  queryFn: () => fetchTotalEquity({ data: { apiKeyId: apiKeyId! } }),
  queryKey: totalEquityQueryKey(apiKeyId ?? ""),
  refetchInterval: 30_000,
 });
};
