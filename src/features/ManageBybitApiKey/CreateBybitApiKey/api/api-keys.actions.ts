import { randomUUID } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { setCookie } from "@tanstack/react-start/server";
import { RestClientV5 } from "bybit-api";
import { count, eq } from "drizzle-orm";
import { SELECTED_API_KEY_STORAGE_KEY } from "@/shared/config/const.ts";
import { getDb } from "@/shared/db/drizzle.ts";
import { apiKeys } from "@/shared/db/schema.ts";
import { secretEnv } from "@/shared/env";
import { getSession } from "@/shared/helpers/getSession";
import { encrypt, maskApiKey } from "@/shared/lib/crypto.ts";
import { assertRateLimit } from "@/shared/lib/rate-limit.ts";
import { withSafeErrors } from "@/shared/lib/safe-error.ts";
import { apiKeySchema, type ApiKeyRecord } from "../model/schema.ts";

export const createApiKey = createServerFn({ method: "POST" })
 .inputValidator((data: unknown) => apiKeySchema.parse(data))
 .handler(
  withSafeErrors(async ({ data }): Promise<ApiKeyRecord> => {
   const session = await getSession();
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

   const db = getDb();

   const [row] = await db
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

   const [totalRow] = await db
    .select({ value: count() })
    .from(apiKeys)
    .where(eq(apiKeys.userId, session.user.id));

   if (totalRow.value === 1) {
    setCookie(SELECTED_API_KEY_STORAGE_KEY, id, { path: "/" });
   }

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
