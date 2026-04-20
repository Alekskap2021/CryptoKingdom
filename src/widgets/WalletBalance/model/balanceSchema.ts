import { z } from "zod";

export const balanceSchema = z.object({
 accountType: z.string(),
 coins: z.array(
  z.object({
   availableToWithdraw: z.string(),
   coin: z.string(),
   equity: z.string(),
   unrealisedPnl: z.string(),
   walletBalance: z.string(),
  }),
 ),
 totalEquity: z.string(),
 totalWalletBalance: z.string(),
});

export type Balance = z.infer<typeof balanceSchema>;
