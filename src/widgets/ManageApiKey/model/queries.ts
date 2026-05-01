import { queryOptions } from "@tanstack/react-query";
import { listApiKeys } from "../api/api-keys.actions.ts";

export const apiKeysQueryKey = ["bybitApiKey", "bybitApiKeyList"] as const;

export const apiKeysQueryOptions = queryOptions({
 queryFn: () => listApiKeys(),
 queryKey: apiKeysQueryKey,
});
