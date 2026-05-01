import { useQuery } from "@tanstack/react-query";
import { apiKeysQueryOptions } from "../model/queries.ts";

export const useQueryApiKeys = () => useQuery(apiKeysQueryOptions);
