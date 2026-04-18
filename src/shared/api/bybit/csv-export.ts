import { createServerFn } from "@tanstack/react-start";
// eslint-disable-next-line @conarti/feature-sliced/layers-slices
import { ensureSession } from "@/features/Authentication/server";
import { createBybitClient, normalizeBybitError } from "./client";

export const exportTradesCsv = createServerFn({ method: "POST" })
 .inputValidator((data: unknown) => {
  const parsed = data as { apiKeyId: string; symbol?: string };
  if (!parsed.apiKeyId) throw new Error("apiKeyId is required");
  return parsed;
 })
 .handler(async ({ data }): Promise<string> => {
  const session = await ensureSession();
  const client = await createBybitClient(data.apiKeyId, session.user.id);

  const allExecutions: Array<Record<string, string>> = [];
  let cursor: string | undefined;

  for (let page = 0; page < 10; page++) {
   const result = await client.getExecutionList({
    category: "linear",
    cursor,
    limit: 100,
    symbol: data.symbol,
   });

   if (result.retCode !== 0) {
    throw new Error(normalizeBybitError(result).message);
   }

   for (const e of result.result.list) {
    allExecutions.push({
     execFee: e.execFee,
     execId: e.execId,
     execPrice: e.execPrice,
     execQty: e.execQty,
     execTime: new Date(Number(e.execTime)).toISOString(),
     execType: e.execType,
     execValue: e.execValue,
     orderId: e.orderId,
     orderType: e.orderType,
     side: e.side,
     symbol: e.symbol,
    });
   }

   cursor = result.result.nextPageCursor;
   if (!cursor) break;
  }

  if (allExecutions.length === 0) {
   return "No trades found";
  }

  const headers = Object.keys(allExecutions[0]);
  const rows = allExecutions.map((row) =>
   headers.map((h) => `"${(row[h] || "").replace(/"/g, '""')}"`).join(","),
  );

  return [headers.join(","), ...rows].join("\n");
 });
