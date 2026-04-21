import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPublicBybitClient, normalizeBybitError } from "@/shared/api/bybit/client.ts";
import { tradingSymbolSchema, type TradingSymbol } from "../model/placeBybitOrder.ts";

const tradingSymbolsSchema = z.array(tradingSymbolSchema);

export const fetchTradingSymbols = createServerFn({ method: "GET" }).handler(
 async (): Promise<TradingSymbol[]> => {
  const client = createPublicBybitClient();

  const result = await client.getInstrumentsInfo({ category: "linear" });
  if (result.retCode !== 0) {
   throw new Error(normalizeBybitError(result).message);
  }

  return tradingSymbolsSchema.parse(
   result.result.list.map((symbol) => ({
    baseCoin: symbol.baseCoin,
    quoteCoin: symbol.quoteCoin,
    status: symbol.status,
    symbol: symbol.symbol,
   })),
  );
 },
);
