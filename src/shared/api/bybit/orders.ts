import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
// eslint-disable-next-line @conarti/feature-sliced/layers-slices
import { ensureSession } from "@/features/Authentication/server";
import { createBybitClient, normalizeBybitError } from "./client";

export const placeOrderSchema = z.object({
 apiKeyId: z.string(),
 orderType: z.enum(["Limit", "Market"]),
 price: z.string().optional(),
 qty: z.string().min(1, "Quantity is required"),
 side: z.enum(["Buy", "Sell"]),
 symbol: z.string().min(1, "Symbol is required"),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

export const placeOrder = createServerFn({ method: "POST" })
 .inputValidator((data: unknown) => placeOrderSchema.parse(data))
 .handler(async ({ data }) => {
  const session = await ensureSession();
  const client = await createBybitClient(data.apiKeyId, session.user.id);

  const params: Record<string, string> = {
   category: "linear",
   orderType: data.orderType,
   qty: data.qty,
   side: data.side,
   symbol: data.symbol,
  };

  if (data.orderType === "Limit" && data.price) {
   params.price = data.price;
   params.timeInForce = "GTC";
  }

  const result = await client.submitOrder(
   params as unknown as Parameters<typeof client.submitOrder>[0],
  );

  if (result.retCode !== 0) {
   const err = normalizeBybitError(result);
   throw new Error(`Order failed: ${err.message} (code: ${err.code})`);
  }

  return {
   orderId: result.result.orderId,
   orderLinkId: result.result.orderLinkId,
  };
 });

export const cancelOrderSchema = z.object({
 apiKeyId: z.string(),
 orderId: z.string(),
 symbol: z.string(),
});

export const cancelOrder = createServerFn({ method: "POST" })
 .inputValidator((data: unknown) => cancelOrderSchema.parse(data))
 .handler(async ({ data }) => {
  const session = await ensureSession();
  const client = await createBybitClient(data.apiKeyId, session.user.id);

  const result = await client.cancelOrder({
   category: "linear",
   orderId: data.orderId,
   symbol: data.symbol,
  });

  if (result.retCode !== 0) {
   const err = normalizeBybitError(result);
   throw new Error(`Cancel failed: ${err.message} (code: ${err.code})`);
  }

  return { orderId: result.result.orderId };
 });

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
