import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/shared/db/drizzle.ts";
import { apiKeys } from "@/shared/db/schema.ts";
import { getSession } from "@/shared/helpers/getSession";
import { withSafeErrors } from "@/shared/lib/safe-error.ts";
import { type ApiKeyRecord } from "../model/schema.ts";

export const listApiKeys = createServerFn({ method: "GET" }).handler(
 withSafeErrors(async (): Promise<ApiKeyRecord[]> => {
  const session = await getSession();

  const rows = await getDb()
   .select({
    createdAt: apiKeys.createdAt,
    id: apiKeys.id,
    label: apiKeys.label,
    maskedKey: apiKeys.maskedKey,
    testnet: apiKeys.testnet,
    updatedAt: apiKeys.updatedAt,
    userId: apiKeys.userId,
   })
   .from(apiKeys)
   .where(eq(apiKeys.userId, session.user.id))
   .orderBy(desc(apiKeys.createdAt));

  return rows.map((r) => ({
   createdAt: r.createdAt.toISOString(),
   id: r.id,
   label: r.label,
   maskedKey: r.maskedKey,
   testnet: r.testnet,
   updatedAt: r.updatedAt.toISOString(),
   userId: r.userId,
  }));
 }, "Failed to load API keys."),
);
