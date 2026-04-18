import { createServerFn } from "@tanstack/react-start";
import { createPublicBybitClient, normalizeBybitError } from "./client";
import type { Kline, SymbolInfo } from "./types";

export const fetchSymbols = createServerFn({ method: "GET" }).handler(
 async (): Promise<SymbolInfo[]> => {
  const client = createPublicBybitClient();

  const result = await client.getInstrumentsInfo({ category: "linear" });
  if (result.retCode !== 0) {
   throw new Error(normalizeBybitError(result).message);
  }

  return result.result.list.map((s) => ({
   baseCoin: s.baseCoin,
   quoteCoin: s.quoteCoin,
   status: s.status,
   symbol: s.symbol,
  }));
 },
);

export const fetchKlines = createServerFn({ method: "GET" })
 .inputValidator((data: unknown) => {
  const parsed = data as {
   end?: number;
   interval: string;
   limit?: number;
   start?: number;
   symbol: string;
  };
  if (!parsed.symbol || !parsed.interval) throw new Error("symbol and interval are required");
  return parsed;
 })
 .handler(async ({ data }): Promise<Kline[]> => {
  const client = createPublicBybitClient();

  const result = await client.getKline({
   category: "linear",
   end: data.end,
   interval: data.interval,
   limit: data.limit || 200,
   start: data.start,
   symbol: data.symbol,
  });
  if (result.retCode !== 0) {
   throw new Error(normalizeBybitError(result).message);
  }

  return result.result.list.map((k) => ({
   close: k[4],
   high: k[2],
   low: k[3],
   open: k[1],
   timestamp: Number(k[0]),
   turnover: k[6],
   volume: k[5],
  }));
 });

export const marketQueryKeys = {
 klines: (symbol: string, interval: string) => ["bybit", "klines", symbol, interval] as const,
 symbols: () => ["bybit", "symbols"] as const,
};
