import { createServerFn } from "@tanstack/react-start";
// eslint-disable-next-line @conarti/feature-sliced/layers-slices
import { ensureSession } from "@/features/Authentication/server";
import { createBybitClient, normalizeBybitError } from "./client";
import type { Execution } from "./types";

export const requireKeyId = (data: unknown) => {
 const parsed = data as { apiKeyId: string };
 if (!parsed.apiKeyId) throw new Error("apiKeyId is required");
 return parsed;
};

export const fetchExecutions = createServerFn({ method: "GET" })
 .inputValidator((data: unknown) => {
  const parsed = data as { apiKeyId: string; cursor?: string; limit?: number; symbol?: string };
  if (!parsed.apiKeyId) throw new Error("apiKeyId is required");
  return parsed;
 })
 .handler(async ({ data }): Promise<{ cursor: string; list: Execution[] }> => {
  const session = await ensureSession();
  const client = await createBybitClient(data.apiKeyId, session.user.id);

  const result = await client.getExecutionList({
   category: "linear",
   cursor: data.cursor,
   limit: data.limit || 50,
   symbol: data.symbol,
  });
  if (result.retCode !== 0) {
   throw new Error(normalizeBybitError(result).message);
  }

  return {
   cursor: result.result.nextPageCursor ?? "",
   list: result.result.list.map((e) => ({
    execFee: e.execFee,
    execId: e.execId,
    execPrice: e.execPrice,
    execQty: e.execQty,
    execTime: e.execTime,
    execType: e.execType,
    execValue: e.execValue,
    orderId: e.orderId,
    orderLinkId: e.orderLinkId,
    orderType: e.orderType,
    side: e.side as Execution["side"],
    symbol: e.symbol,
   })),
  };
 });

export const queryKeys = {
 balance: (apiKeyId: string) => ["bybit", "balance", apiKeyId] as const,
 executions: (apiKeyId: string, filters?: { symbol?: string }) =>
  ["bybit", "executions", apiKeyId, filters] as const,
 openOrders: (apiKeyId: string) => ["bybit", "openOrders", apiKeyId] as const,
 positions: (apiKeyId: string) => ["bybit", "positions", apiKeyId] as const,
};
