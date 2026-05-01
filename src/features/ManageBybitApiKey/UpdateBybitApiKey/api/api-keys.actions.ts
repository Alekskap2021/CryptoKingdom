import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/shared/db/drizzle.ts";
import { apiKeys } from "@/shared/db/schema.ts";
import { getSession } from "@/shared/helpers/getSession";
import { assertRateLimit } from "@/shared/lib/rate-limit.ts";
import { withSafeErrors } from "@/shared/lib/safe-error.ts";
import { apiKeyUpdateSchema } from "../model/schema.ts";

export const updateApiKey = createServerFn({ method: "POST" })
 .inputValidator((data: unknown) => {
  const parsed = data as { id: string; label: string };
  return { id: parsed.id, ...apiKeyUpdateSchema.parse(parsed) };
 })
 .handler(
  withSafeErrors(async ({ data }): Promise<{ success: boolean }> => {
   const session = await getSession();
   assertRateLimit(`update:${session.user.id}`, { maxRequests: 10, windowMs: 60_000 });

   const result = await getDb()
    .update(apiKeys)
    .set({ label: data.label })
    .where(and(eq(apiKeys.id, data.id), eq(apiKeys.userId, session.user.id)));

   if (result.rowCount === 0) {
    throw new Error("API key not found");
   }

   return { success: true };
  }, "Failed to update API key."),
 );
