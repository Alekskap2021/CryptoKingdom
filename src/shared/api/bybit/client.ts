import { RestClientV5 } from "bybit-api";
import { and, eq } from "drizzle-orm";
import { getDb } from "../../db/drizzle";
import { apiKeys } from "../../db/schema";
import { secretEnv } from "../../env";
import { decrypt } from "../../lib/crypto";

export async function createBybitClient(apiKeyId: string, userId: string): Promise<RestClientV5> {
 const [row] = await getDb()
  .select({
   encryptedApiKey: apiKeys.encryptedApiKey,
   encryptedApiSecret: apiKeys.encryptedApiSecret,
   testnet: apiKeys.testnet,
  })
  .from(apiKeys)
  .where(and(eq(apiKeys.id, apiKeyId), eq(apiKeys.userId, userId)));

 if (!row) {
  throw new Error("API key not found");
 }

 const apiKey = decrypt(row.encryptedApiKey, secretEnv.APP_ENCRYPTION_KEY);
 const apiSecret = decrypt(row.encryptedApiSecret, secretEnv.APP_ENCRYPTION_KEY);

 return new RestClientV5({
  key: apiKey,
  secret: apiSecret,
  testnet: row.testnet,
 });
}

export function createPublicBybitClient(testnet = false): RestClientV5 {
 return new RestClientV5({
  testnet,
 });
}

export function normalizeBybitError(error: unknown): { code: string; message: string } {
 if (error && typeof error === "object" && "retCode" in error) {
  const e = error as { retCode: number; retMsg: string };
  return { code: String(e.retCode), message: e.retMsg };
 }

 if (error instanceof Error) {
  return { code: "UNKNOWN", message: error.message };
 }

 return { code: "UNKNOWN", message: "An unexpected error occurred" };
}
