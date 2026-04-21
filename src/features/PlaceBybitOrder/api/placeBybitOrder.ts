import { createServerFn } from "@tanstack/react-start";
import { createBybitClient, normalizeBybitError } from "@/shared/api/bybit/client.ts";
import { getSession } from "@/shared/helpers/getSession";
import { placeBybitOrderSchema, type PlaceBybitOrderInput } from "../model/placeBybitOrder.ts";

export const placeBybitOrder = createServerFn({ method: "POST" })
 .inputValidator((data: unknown) => placeBybitOrderSchema.parse(data))
 .handler(async ({ data }): Promise<{ orderId: string; orderLinkId: string }> => {
  const session = await getSession();
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
   const error = normalizeBybitError(result);
   throw new Error(`Order failed: ${error.message} (code: ${error.code})`);
  }

  return {
   orderId: result.result.orderId,
   orderLinkId: result.result.orderLinkId,
  };
 });

export type { PlaceBybitOrderInput };
