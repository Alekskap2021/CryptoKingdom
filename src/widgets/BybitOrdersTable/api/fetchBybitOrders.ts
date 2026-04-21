import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBybitClient, normalizeBybitError } from "@/shared/api/bybit/client.ts";
import { requireKeyId } from "@/shared/api/bybit/queries.ts";
import { ensureSession } from "@/features/Authentication/server.ts";
import { orderSchema, type Order } from "../model/orderSchema.ts";

const bybitOrdersSchema = z.array(orderSchema);

export const fetchBybitOrders = createServerFn({ method: "GET" })
 .inputValidator(requireKeyId)
 .handler(async ({ data }): Promise<Order[]> => {
  const session = await ensureSession();
  const client = await createBybitClient(data.apiKeyId, session.user.id);

  const result = await client.getActiveOrders({ category: "linear" });
  if (result.retCode !== 0) {
   throw new Error(normalizeBybitError(result).message);
  }

  return bybitOrdersSchema.parse(
   result.result.list.map((order) => ({
    avgPrice: order.avgPrice,
    createdTime: order.createdTime,
    cumExecQty: order.cumExecQty,
    cumExecValue: order.cumExecValue,
    orderId: order.orderId,
    orderLinkId: order.orderLinkId,
    orderStatus: order.orderStatus,
    orderType: order.orderType,
    price: order.price,
    qty: order.qty,
    side: order.side,
    symbol: order.symbol,
    updatedTime: order.updatedTime,
   })),
  );
 });
