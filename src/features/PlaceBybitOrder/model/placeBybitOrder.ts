import { z } from "zod";

export const placeBybitOrderSchema = z.object({
 apiKeyId: z.string(),
 orderType: z.enum(["Limit", "Market"]),
 price: z.string().optional(),
 qty: z.string().min(1, "Quantity is required"),
 side: z.enum(["Buy", "Sell"]),
 symbol: z.string().min(1, "Symbol is required"),
});

export type PlaceBybitOrderInput = z.infer<typeof placeBybitOrderSchema>;

export const tradingSymbolSchema = z.object({
 baseCoin: z.string(),
 quoteCoin: z.string(),
 status: z.string(),
 symbol: z.string(),
});

export type TradingSymbol = z.infer<typeof tradingSymbolSchema>;
