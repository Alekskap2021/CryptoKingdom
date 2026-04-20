import { createServerFn } from "@tanstack/react-start";
import { createBybitClient, normalizeBybitError } from "@/shared/api/bybit/client.ts";
import { requireKeyId } from "@/shared/api/bybit/queries.ts";
import { ensureSession } from "@/features/Authentication/server.ts";
import type { Balance } from "../model/balanceSchema";

export const fetchBalance = createServerFn({ method: "GET" })
 .inputValidator(requireKeyId)
 .handler(async ({ data }): Promise<Balance> => {
  const session = await ensureSession();
  const client = await createBybitClient(data.apiKeyId, session.user.id);

  const result = await client.getWalletBalance({ accountType: "UNIFIED" });
  if (result.retCode !== 0) {
   throw new Error(normalizeBybitError(result).message);
  }

  const account = result.result.list[0];
  return {
   accountType: account.accountType,
   coins: account.coin.map((c) => ({
    availableToWithdraw: c.availableToWithdraw,
    coin: c.coin,
    equity: c.equity,
    unrealisedPnl: c.unrealisedPnl,
    walletBalance: c.walletBalance,
   })),
   totalEquity: account.totalEquity,
   totalWalletBalance: account.totalWalletBalance,
  };
 });
