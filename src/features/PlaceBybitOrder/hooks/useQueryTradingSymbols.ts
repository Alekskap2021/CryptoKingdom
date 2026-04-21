import { useQuery } from "@tanstack/react-query";
import { fetchTradingSymbols } from "../api/fetchTradingSymbols.ts";

export const tradingSymbolsQueryKey = ["bybit", "tradingSymbols"] as const;

export const useQueryTradingSymbols = () =>
 useQuery({
  queryFn: fetchTradingSymbols,
  queryKey: tradingSymbolsQueryKey,
 });
