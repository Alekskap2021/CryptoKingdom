import { z } from "zod";
import { envSecretSchema, envPublicSchema } from "./sсhema.ts";
import type { SecretEnv, PublicEnv } from "./sсhema.ts";

function loadEnv<T extends z.ZodTypeAny>(
 envObject: ImportMetaEnv | NodeJS.ProcessEnv,
 schema: T,
): z.infer<T> {
 const result = schema.safeParse(envObject);

 if (!result.success) {
  const formatted = result.error.issues
   .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
   .join("\n");

  throw new Error(`Invalid environment variables:\n${formatted}`);
 }

 return result.data;
}

export const publicEnv: PublicEnv = loadEnv(import.meta.env, envPublicSchema);

export const secretEnv: SecretEnv = import.meta.env.SSR
 ? loadEnv(process.env, envSecretSchema)
 : new Proxy({} as SecretEnv, {
    get(_, key) {
     throw new Error(
      `Cannot access secretEnv.${String(key)} on the client. Use publicEnv instead.`,
     );
    },
   });
