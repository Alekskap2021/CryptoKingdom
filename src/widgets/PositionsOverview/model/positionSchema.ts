import { z } from "zod";

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
