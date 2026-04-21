import { z } from "zod";

export const cancelBybitOrderSchema = z.object({
 apiKeyId: z.string(),
 orderId: z.string(),
 symbol: z.string(),
});

export type CancelBybitOrderInput = z.infer<typeof cancelBybitOrderSchema>;
