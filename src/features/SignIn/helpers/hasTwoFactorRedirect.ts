import type { SignInTwoFactorStep } from "../model/signIn.ts";

export const hasTwoFactorRedirect = (value: unknown): value is SignInTwoFactorStep =>
 Boolean(
  value &&
  typeof value === "object" &&
  "twoFactorRedirect" in value &&
  typeof value.twoFactorRedirect === "boolean",
 );
