import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
// eslint-disable-next-line @conarti/feature-sliced/layers-slices
import { ensureSession } from "@/features/Authentication/server";
import { createBybitClient, normalizeBybitError } from "./client";

export const amendOrderSchema = z.object({
 apiKeyId: z.string(),
 orderId: z.string(),
 price: z.string().optional(),
 qty: z.string().optional(),
 symbol: z.string(),
});

export const amendOrder = createServerFn({ method: "POST" })
 .inputValidator((data: unknown) => amendOrderSchema.parse(data))
 .handler(async ({ data }) => {
  const session = await ensureSession();
  const client = await createBybitClient(data.apiKeyId, session.user.id);

  const params: Record<string, string> = {
   category: "linear",
   orderId: data.orderId,
   symbol: data.symbol,
  };

  if (data.price) params.price = data.price;
  if (data.qty) params.qty = data.qty;

  const result = await client.amendOrder(
   params as unknown as Parameters<typeof client.amendOrder>[0],
  );

  if (result.retCode !== 0) {
   const err = normalizeBybitError(result);
   throw new Error(`Amend failed: ${err.message} (code: ${err.code})`);
  }

  return { orderId: result.result.orderId };
 });
