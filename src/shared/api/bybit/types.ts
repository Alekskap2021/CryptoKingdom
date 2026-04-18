import { z } from "zod";

export const balanceSchema = z.object({
 accountType: z.string(),
 coins: z.array(
  z.object({
   availableToWithdraw: z.string(),
   coin: z.string(),
   equity: z.string(),
   unrealisedPnl: z.string(),
   walletBalance: z.string(),
  }),
 ),
 totalEquity: z.string(),
 totalWalletBalance: z.string(),
});

export type Balance = z.infer<typeof balanceSchema>;

export const positionSchema = z.object({
 avgPrice: z.string(),
 createdTime: z.string(),
 cumRealisedPnl: z.string(),
 leverage: z.string(),
 liqPrice: z.string(),
 markPrice: z.string(),
 positionIdx: z.number(),
 positionValue: z.string(),
 side: z.enum(["Buy", "None", "Sell"]),
 size: z.string(),
 symbol: z.string(),
 unrealisedPnl: z.string(),
 updatedTime: z.string(),
});

export type Position = z.infer<typeof positionSchema>;

export const orderSchema = z.object({
 avgPrice: z.string(),
 createdTime: z.string(),
 cumExecQty: z.string(),
 cumExecValue: z.string(),
 orderId: z.string(),
 orderLinkId: z.string(),
 orderStatus: z.string(),
 orderType: z.enum(["Limit", "Market"]),
 price: z.string(),
 qty: z.string(),
 side: z.enum(["Buy", "Sell"]),
 symbol: z.string(),
 updatedTime: z.string(),
});

export type Order = z.infer<typeof orderSchema>;

export const executionSchema = z.object({
 execFee: z.string(),
 execId: z.string(),
 execPrice: z.string(),
 execQty: z.string(),
 execTime: z.string(),
 execType: z.string(),
 execValue: z.string(),
 orderId: z.string(),
 orderLinkId: z.string(),
 orderType: z.string(),
 side: z.enum(["Buy", "Sell"]),
 symbol: z.string(),
});

export type Execution = z.infer<typeof executionSchema>;

export const klineSchema = z.object({
 close: z.string(),
 high: z.string(),
 low: z.string(),
 open: z.string(),
 timestamp: z.number(),
 turnover: z.string(),
 volume: z.string(),
});

export type Kline = z.infer<typeof klineSchema>;

export const symbolInfoSchema = z.object({
 baseCoin: z.string(),
 quoteCoin: z.string(),
 status: z.string(),
 symbol: z.string(),
});

export type SymbolInfo = z.infer<typeof symbolInfoSchema>;
