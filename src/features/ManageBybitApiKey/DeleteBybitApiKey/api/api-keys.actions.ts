import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { and, desc, eq } from "drizzle-orm";
import { SELECTED_API_KEY_STORAGE_KEY } from "@/shared/config/const.ts";
import { getDb } from "@/shared/db/drizzle.ts";
import { apiKeys } from "@/shared/db/schema.ts";
import { getSession } from "@/shared/helpers/getSession";
import { assertRateLimit } from "@/shared/lib/rate-limit.ts";
import { withSafeErrors } from "@/shared/lib/safe-error.ts";

interface DeleteApiKeyResult {
 nextSelectedId: null | string;
 success: boolean;
}

export const deleteApiKey = createServerFn({ method: "POST" })
 .inputValidator((data: unknown) => {
  const parsed = data as { id: string };
  if (!parsed.id) throw new Error("id is required");
  return parsed;
 })
 .handler(
  withSafeErrors(async ({ data }): Promise<DeleteApiKeyResult> => {
   const session = await getSession();
   assertRateLimit(`delete:${session.user.id}`, { maxRequests: 10, windowMs: 60_000 });

   const db = getDb();

   const result = await db
    .delete(apiKeys)
    .where(and(eq(apiKeys.id, data.id), eq(apiKeys.userId, session.user.id)));

   if (result.rowCount === 0) {
    throw new Error("API key not found");
   }

   const selectedId = getCookie(SELECTED_API_KEY_STORAGE_KEY);

   if (selectedId !== data.id) {
    return { nextSelectedId: selectedId ?? null, success: true };
   }

   const [next] = await db
    .select({ id: apiKeys.id })
    .from(apiKeys)
    .where(eq(apiKeys.userId, session.user.id))
    .orderBy(desc(apiKeys.createdAt))
    .limit(1);

   if (next) {
    setCookie(SELECTED_API_KEY_STORAGE_KEY, next.id, { path: "/" });
    return { nextSelectedId: next.id, success: true };
   }

   deleteCookie(SELECTED_API_KEY_STORAGE_KEY, { path: "/" });
   return { nextSelectedId: null, success: true };
  }, "Failed to delete API key."),
 );
