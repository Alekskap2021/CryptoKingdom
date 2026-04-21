import { createServerFn } from "@tanstack/react-start";
import { createBybitClient, normalizeBybitError } from "@/shared/api/bybit/client.ts";
// eslint-disable-next-line @conarti/feature-sliced/layers-slices
import { ensureSession } from "@/features/Authentication/server.ts";
import { cancelBybitOrderSchema, type CancelBybitOrderInput } from "../model/cancelBybitOrder.ts";

export const cancelBybitOrder = createServerFn({ method: "POST" })
 .inputValidator((data: unknown) => cancelBybitOrderSchema.parse(data))
 .handler(async ({ data }): Promise<{ orderId: string }> => {
  const session = await ensureSession();
  const client = await createBybitClient(data.apiKeyId, session.user.id);

  const result = await client.cancelOrder({
   category: "linear",
   orderId: data.orderId,
   symbol: data.symbol,
  });
  if (result.retCode !== 0) {
   const error = normalizeBybitError(result);
   throw new Error(`Cancel failed: ${error.message} (code: ${error.code})`);
  }

  return { orderId: result.result.orderId };
 });

export type { CancelBybitOrderInput };
