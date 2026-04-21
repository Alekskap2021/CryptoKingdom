import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getDb } from "../db/drizzle";
import { secretEnv } from "../env";

function createAuth() {
 return betterAuth({
  appName: "CryptoKingdom",
  baseURL: secretEnv.VITE_BASE_URL,
  database: drizzleAdapter(getDb(), {
   provider: "pg",
  }),
  emailAndPassword: {
   enabled: true,
  },
  plugins: [
   twoFactor({
    issuer: "CryptoKingdom",
   }),
   tanstackStartCookies(),
  ],
  secret: secretEnv.BETTER_AUTH_SECRET,
  session: {
   cookieCache: {
    enabled: true,
    maxAge: 5 * 60,
   },
  },
 });
}

type AuthInstance = ReturnType<typeof createAuth>;

let auth: AuthInstance | undefined;

export function getAuth(): AuthInstance {
 if (!auth) {
  auth = createAuth();
 }

 return auth;
}
