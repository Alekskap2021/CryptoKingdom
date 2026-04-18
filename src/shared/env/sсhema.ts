import z from "zod";

export const envPublicSchema = z.object({
 DEV: z.boolean().default(false),
 MODE: z.enum(["development", "production", "staging"]).default("production"),
 NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

 PROD: z.boolean().default(false),
 SSR: z.boolean().default(false),
 VITE_BASE_URL: z.url("BASE_URL must be a valid URL"),
});

export const envSecretSchema = envPublicSchema.extend({
 APP_ENCRYPTION_KEY: z.string().min(32, "APP_ENCRYPTION_KEY must be at least 32 characters"),
 BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),

 BYBIT_REST_BASE_URL: z.url().default("https://api.bybit.com"),
 BYBIT_WS_PRIVATE_URL: z.string().default("wss://stream.bybit.com/v5/private"),
 BYBIT_WS_PUBLIC_URL: z.string().default("wss://stream.bybit.com/v5/public/linear"),

 DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

export type PublicEnv = z.infer<typeof envPublicSchema>;
export type SecretEnv = z.infer<typeof envSecretSchema>;
