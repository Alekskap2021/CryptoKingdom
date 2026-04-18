import { createServerFn } from "@tanstack/react-start";
// eslint-disable-next-line @conarti/feature-sliced/layers-slices
import { ensureSession } from "@/features/Authentication/server";
import { createBybitClient, normalizeBybitError } from "./client";
import type { Balance, Execution, Order, Position } from "./types";

const requireKeyId = (data: unknown) => {
 const parsed = data as { apiKeyId: string };
 if (!parsed.apiKeyId) throw new Error("apiKeyId is required");
 return parsed;
};

export const fetchBalance = createServerFn({ method: "GET" })
 .inputValidator(requireKeyId)
 .handler(async ({ data }): Promise<Balance> => {
  const session = await ensureSession();
  const client = await createBybitClient(data.apiKeyId, session.user.id);

  const result = await client.getWalletBalance({ accountType: "UNIFIED" });
  if (result.retCode !== 0) {
   throw new Error(normalizeBybitError(result).message);
  }

  const account = result.result.list[0];
  return {
   accountType: account.accountType,
   coins: account.coin.map((c) => ({
    availableToWithdraw: c.availableToWithdraw,
    coin: c.coin,
    equity: c.equity,
    unrealisedPnl: c.unrealisedPnl,
    walletBalance: c.walletBalance,
   })),
   totalEquity: account.totalEquity,
   totalWalletBalance: account.totalWalletBalance,
  };
 });

export const fetchPositions = createServerFn({ method: "GET" })
 .inputValidator(requireKeyId)
 .handler(async ({ data }): Promise<Position[]> => {
  const session = await ensureSession();
  const client = await createBybitClient(data.apiKeyId, session.user.id);

  const result = await client.getPositionInfo({ category: "linear", settleCoin: "USDT" });
  if (result.retCode !== 0) {
   throw new Error(normalizeBybitError(result).message);
  }

  return result.result.list
   .filter((p) => p.size !== "0")
   .map((p) => ({
    avgPrice: p.avgPrice,
    createdTime: p.createdTime,
    cumRealisedPnl: p.cumRealisedPnl,
    leverage: p.leverage,
    liqPrice: p.liqPrice,
    markPrice: p.markPrice,
    positionIdx: p.positionIdx,
    positionValue: p.positionValue,
    side: p.side as Position["side"],
    size: p.size,
    symbol: p.symbol,
    unrealisedPnl: p.unrealisedPnl,
    updatedTime: p.updatedTime,
   }));
 });

export const fetchOpenOrders = createServerFn({ method: "GET" })
 .inputValidator(requireKeyId)
 .handler(async ({ data }): Promise<Order[]> => {
  const session = await ensureSession();
  const client = await createBybitClient(data.apiKeyId, session.user.id);

  const result = await client.getActiveOrders({ category: "linear" });
  if (result.retCode !== 0) {
   throw new Error(normalizeBybitError(result).message);
  }

  return result.result.list.map((o) => ({
   avgPrice: o.avgPrice,
   createdTime: o.createdTime,
   cumExecQty: o.cumExecQty,
   cumExecValue: o.cumExecValue,
   orderId: o.orderId,
   orderLinkId: o.orderLinkId,
   orderStatus: o.orderStatus,
   orderType: o.orderType as Order["orderType"],
   price: o.price,
   qty: o.qty,
   side: o.side as Order["side"],
   symbol: o.symbol,
   updatedTime: o.updatedTime,
  }));
 });

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
   cursor: result.result.nextPageCursor,
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
