import { createServerFn } from "@tanstack/react-start";
import { createBybitClient, normalizeBybitError } from "@/shared/api/bybit/client.ts";
import { requireKeyId } from "@/shared/api/bybit/queries.ts";
import { getSession } from "@/shared/helpers/getSession";

interface TotalEquityDto {
 totalEquity: string;
}

export const fetchTotalEquity = createServerFn({ method: "GET" })
 .inputValidator(requireKeyId)
 .handler(async ({ data }): Promise<TotalEquityDto> => {
  const session = await getSession();
  const client = await createBybitClient(data.apiKeyId, session.user.id);

  const result = await client.getWalletBalance({ accountType: "UNIFIED" });
  if (result.retCode !== 0) {
   throw new Error(normalizeBybitError(result).message);
  }

  return {
   totalEquity: result.result.list[0]?.totalEquity ?? "0",
  };
 });
