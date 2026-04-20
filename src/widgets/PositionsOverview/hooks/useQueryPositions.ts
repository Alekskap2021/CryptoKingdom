import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/bybit/queries.ts";
import { fetchPositions } from "../api/fetchPositions.ts";

export const positionsQueryKey = (apiKeyId: string) => queryKeys.positions(apiKeyId);

interface UseQueryPositionsParams {
 apiKeyId?: string;
}

export const useQueryPositions = (params: UseQueryPositionsParams) => {
 const { apiKeyId } = params;

 return useQuery({
  enabled: Boolean(apiKeyId),
  queryFn: () => fetchPositions({ data: { apiKeyId: apiKeyId! } }),
  queryKey: positionsQueryKey(apiKeyId ?? ""),
  refetchInterval: 15_000,
 });
};
