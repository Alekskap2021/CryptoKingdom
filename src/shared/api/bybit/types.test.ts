import { describe, expect, it } from "vitest";
import { balanceSchema, orderSchema, positionSchema } from "./types";

describe("balanceSchema", () => {
 it("parses valid balance", () => {
  const result = balanceSchema.safeParse({
   accountType: "UNIFIED",
   coins: [
    {
     availableToWithdraw: "100.5",
     coin: "USDT",
     equity: "200.0",
     unrealisedPnl: "10.0",
     walletBalance: "190.0",
    },
   ],
   totalEquity: "200.0",
   totalWalletBalance: "190.0",
  });
  expect(result.success).toBe(true);
 });
});

describe("positionSchema", () => {
 it("parses valid position", () => {
  const result = positionSchema.safeParse({
   avgPrice: "50000",
   createdTime: "1700000000000",
   cumRealisedPnl: "100",
   leverage: "10",
   liqPrice: "45000",
   markPrice: "51000",
   positionIdx: 0,
   positionValue: "5000",
   side: "Buy",
   size: "0.1",
   symbol: "BTCUSDT",
   unrealisedPnl: "100",
   updatedTime: "1700000000000",
  });
  expect(result.success).toBe(true);
 });

 it("rejects invalid side", () => {
  const result = positionSchema.safeParse({
   avgPrice: "50000",
   createdTime: "1700000000000",
   cumRealisedPnl: "100",
   leverage: "10",
   liqPrice: "45000",
   markPrice: "51000",
   positionIdx: 0,
   positionValue: "5000",
   side: "Invalid",
   size: "0.1",
   symbol: "BTCUSDT",
   unrealisedPnl: "100",
   updatedTime: "1700000000000",
  });
  expect(result.success).toBe(false);
 });
});

describe("orderSchema", () => {
 it("parses valid order", () => {
  const result = orderSchema.safeParse({
   avgPrice: "0",
   createdTime: "1700000000000",
   cumExecQty: "0",
   cumExecValue: "0",
   orderId: "abc-123",
   orderLinkId: "",
   orderStatus: "New",
   orderType: "Limit",
   price: "50000",
   qty: "0.01",
   side: "Buy",
   symbol: "BTCUSDT",
   updatedTime: "1700000000000",
  });
  expect(result.success).toBe(true);
 });
});
