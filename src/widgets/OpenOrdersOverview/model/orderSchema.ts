import { z } from "zod";

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
