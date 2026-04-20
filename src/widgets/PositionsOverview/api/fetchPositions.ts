import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBybitClient, normalizeBybitError } from "@/shared/api/bybit/client.ts";
import { requireKeyId } from "@/shared/api/bybit/queries.ts";
import { ensureSession } from "@/features/Authentication/server.ts";
import { positionSchema, type Position } from "../model/positionSchema.ts";

const positionsSchema = z.array(positionSchema);

export const fetchPositions = createServerFn({ method: "GET" })
 .inputValidator(requireKeyId)
 .handler(async ({ data }): Promise<Position[]> => {
  const session = await ensureSession();
  const client = await createBybitClient(data.apiKeyId, session.user.id);

  const result = await client.getPositionInfo({ category: "linear", settleCoin: "USDT" });
  if (result.retCode !== 0) {
   throw new Error(normalizeBybitError(result).message);
  }

  return positionsSchema.parse(
   result.result.list
    .filter((position) => position.size !== "0")
    .map((position) => ({
     avgPrice: position.avgPrice,
     createdTime: position.createdTime,
     cumRealisedPnl: position.cumRealisedPnl,
     leverage: position.leverage,
     liqPrice: position.liqPrice,
     markPrice: position.markPrice,
     positionIdx: position.positionIdx,
     positionValue: position.positionValue,
     side: position.side,
     size: position.size,
     symbol: position.symbol,
     unrealisedPnl: position.unrealisedPnl,
     updatedTime: position.updatedTime,
    })),
  );
 });
