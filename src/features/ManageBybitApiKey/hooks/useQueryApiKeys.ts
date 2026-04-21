import { useQuery } from "@tanstack/react-query";
import { listApiKeys } from "../api/api-keys.actions.ts";

export const apiKeysQueryKey = ["bybit", "apiKeys"] as const;

export const useQueryApiKeys = () =>
 useQuery({
  queryFn: listApiKeys,
  queryKey: apiKeysQueryKey,
 });
