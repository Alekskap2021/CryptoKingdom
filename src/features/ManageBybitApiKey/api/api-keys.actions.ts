import { randomUUID } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { RestClientV5 } from "bybit-api";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/shared/db/drizzle.ts";
import { apiKeys } from "@/shared/db/schema.ts";
import { secretEnv } from "@/shared/env";
import { encrypt, maskApiKey } from "@/shared/lib/crypto.ts";
import { assertRateLimit } from "@/shared/lib/rate-limit.ts";
import { withSafeErrors } from "@/shared/lib/safe-error.ts";
// eslint-disable-next-line @conarti/feature-sliced/layers-slices
import { ensureSession } from "@/features/Authentication/server.ts";
import { apiKeySchema, apiKeyUpdateSchema, type ApiKeyRecord } from "../model/schema.ts";

export const listApiKeys = createServerFn({ method: "GET" }).handler(
 withSafeErrors(async (): Promise<ApiKeyRecord[]> => {
  const session = await ensureSession();

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

export const createApiKey = createServerFn({ method: "POST" })
 .inputValidator((data: unknown) => apiKeySchema.parse(data))
 .handler(
  withSafeErrors(async ({ data }): Promise<ApiKeyRecord> => {
   const session = await ensureSession();
   assertRateLimit(`create:${session.user.id}`, { maxRequests: 5, windowMs: 60_000 });

   const client = new RestClientV5({
    key: data.apiKey,
    secret: data.apiSecret,
    testnet: data.testnet,
   });

   try {
    const result = await client.getWalletBalance({ accountType: "UNIFIED" });
    console.log("🚀 ~  ~ result: ", result);

    if (result.retCode !== 0) {
     throw new Error("Invalid API key: Bybit rejected the credentials.");
    }
   } catch (error) {
    if (error instanceof Error && error.message.startsWith("Invalid API key")) {
     console.log("🚀 ~  ~ error: ", error);
     throw error;
    }

    throw new Error("Invalid API key: unable to authenticate with Bybit.");
   }

   const id = randomUUID();
   const encryptedApiKey = encrypt(data.apiKey, secretEnv.APP_ENCRYPTION_KEY);
   const encryptedApiSecret = encrypt(data.apiSecret, secretEnv.APP_ENCRYPTION_KEY);
   const maskedKey = maskApiKey(data.apiKey);

   const [row] = await getDb()
    .insert(apiKeys)
    .values({
     encryptedApiKey,
     encryptedApiSecret,
     id,
     label: data.label,
     maskedKey,
     testnet: data.testnet,
     userId: session.user.id,
    })
    .returning({
     createdAt: apiKeys.createdAt,
     updatedAt: apiKeys.updatedAt,
    });

   return {
    createdAt: row.createdAt.toISOString(),
    id,
    label: data.label,
    maskedKey,
    testnet: data.testnet,
    updatedAt: row.updatedAt.toISOString(),
    userId: session.user.id,
   };
  }, "Failed to create API key."),
 );

export const updateApiKey = createServerFn({ method: "POST" })
 .inputValidator((data: unknown) => {
  const parsed = data as { id: string; label: string };
  return { id: parsed.id, ...apiKeyUpdateSchema.parse(parsed) };
 })
 .handler(
  withSafeErrors(async ({ data }): Promise<{ success: boolean }> => {
   const session = await ensureSession();
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

export const deleteApiKey = createServerFn({ method: "POST" })
 .inputValidator((data: unknown) => {
  const parsed = data as { id: string };
  if (!parsed.id) throw new Error("id is required");
  return parsed;
 })
 .handler(
  withSafeErrors(async ({ data }): Promise<{ success: boolean }> => {
   const session = await ensureSession();
   assertRateLimit(`delete:${session.user.id}`, { maxRequests: 10, windowMs: 60_000 });

   const result = await getDb()
    .delete(apiKeys)
    .where(and(eq(apiKeys.id, data.id), eq(apiKeys.userId, session.user.id)));

   if (result.rowCount === 0) {
    throw new Error("API key not found");
   }

   return { success: true };
  }, "Failed to delete API key."),
 );
