import { queryKeys } from "./queries";
import { PRIVATE_WS_TOPICS, type WsMessageHandler } from "./ws-manager";
import type { Balance, Order, Position } from "./types";
import type { QueryClient } from "@tanstack/react-query";

export function createWsSyncHandler(queryClient: QueryClient, apiKeyId: string): WsMessageHandler {
 return (topic: string, data: unknown) => {
  switch (topic) {
   case PRIVATE_WS_TOPICS.execution:
    queryClient.invalidateQueries({ queryKey: ["bybit", "executions", apiKeyId] });
    break;
   case PRIVATE_WS_TOPICS.order:
    handleOrderUpdate(queryClient, apiKeyId, data);
    break;
   case PRIVATE_WS_TOPICS.position:
    handlePositionUpdate(queryClient, apiKeyId, data);
    break;
   case PRIVATE_WS_TOPICS.wallet:
    handleWalletUpdate(queryClient, apiKeyId, data);
    break;
  }
 };
}

function handleWalletUpdate(queryClient: QueryClient, apiKeyId: string, data: unknown) {
 const walletData = data as Array<{
  accountType: string;
  coin: Array<{
   availableToWithdraw: string;
   coin: string;
   equity: string;
   unrealisedPnl: string;
   walletBalance: string;
  }>;
  totalEquity: string;
  totalWalletBalance: string;
 }>;

 if (!Array.isArray(walletData) || walletData.length === 0) return;

 const update = walletData[0];
 queryClient.setQueryData<Balance>(queryKeys.balance(apiKeyId), (prev) => {
  if (!prev) return prev;
  return {
   ...prev,
   coins: update.coin.map((c) => ({
    availableToWithdraw: c.availableToWithdraw,
    coin: c.coin,
    equity: c.equity,
    unrealisedPnl: c.unrealisedPnl,
    walletBalance: c.walletBalance,
   })),
   totalEquity: update.totalEquity,
   totalWalletBalance: update.totalWalletBalance,
  };
 });
}

function handlePositionUpdate(queryClient: QueryClient, apiKeyId: string, data: unknown) {
 const posData = data as Array<{
  avgPrice: string;
  createdTime: string;
  cumRealisedPnl: string;
  leverage: string;
  liqPrice: string;
  markPrice: string;
  positionIdx: number;
  positionValue: string;
  side: string;
  size: string;
  symbol: string;
  unrealisedPnl: string;
  updatedTime: string;
 }>;

 if (!Array.isArray(posData)) return;

 queryClient.setQueryData<Position[]>(queryKeys.positions(apiKeyId), (prev) => {
  if (!prev) return prev;
  const updated = [...prev];

  for (const p of posData) {
   const idx = updated.findIndex(
    (ex) => ex.symbol === p.symbol && ex.positionIdx === p.positionIdx,
   );
   const mapped: Position = {
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
   };

   if (p.size === "0") {
    if (idx >= 0) updated.splice(idx, 1);
   } else if (idx >= 0) {
    updated[idx] = mapped;
   } else {
    updated.push(mapped);
   }
  }

  return updated;
 });
}

function handleOrderUpdate(queryClient: QueryClient, apiKeyId: string, data: unknown) {
 const orderData = data as Array<{
  avgPrice: string;
  createdTime: string;
  cumExecQty: string;
  cumExecValue: string;
  orderId: string;
  orderLinkId: string;
  orderStatus: string;
  orderType: string;
  price: string;
  qty: string;
  side: string;
  symbol: string;
  updatedTime: string;
 }>;

 if (!Array.isArray(orderData)) return;

 queryClient.setQueryData<Order[]>(queryKeys.openOrders(apiKeyId), (prev) => {
  if (!prev) return prev;
  const updated = [...prev];
  const closedStatuses = new Set(["Cancelled", "Deactivated", "Filled", "Rejected"]);

  for (const o of orderData) {
   const idx = updated.findIndex((ex) => ex.orderId === o.orderId);
   const mapped: Order = {
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
   };

   if (closedStatuses.has(o.orderStatus)) {
    if (idx >= 0) updated.splice(idx, 1);
   } else if (idx >= 0) {
    updated[idx] = mapped;
   } else {
    updated.push(mapped);
   }
  }

  return updated;
 });
}
