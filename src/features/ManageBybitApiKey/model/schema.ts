import { z } from "zod";

export const apiKeySchema = z.object({
 apiKey: z.string().min(1, "API Key is required"),
 apiSecret: z.string().min(1, "API Secret is required"),
 label: z.string().min(1, "Label is required").max(64),
 testnet: z.boolean().default(false),
});
export type ApiKeyInput = z.infer<typeof apiKeySchema>;

export const apiKeyUpdateSchema = z.object({
 label: z.string().min(1, "Label is required").max(64),
});
export type ApiKeyUpdateInput = z.infer<typeof apiKeyUpdateSchema>;

export interface ApiKeyRecord {
 createdAt: string;
 id: string;
 label: string;
 maskedKey: string;
 testnet: boolean;
 updatedAt: string;
 userId: string;
}

export interface ApiKeyWithSecrets extends ApiKeyRecord {
 encryptedApiKey: string;
 encryptedApiSecret: string;
}
