import { z } from "zod";

export const signInSchema = z.object({
 email: z.email("Please enter a valid email address"),
 password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const signInTotpSchema = z.object({
 code: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit code"),
});

export interface SignInTwoFactorStep {
 twoFactorMethods: Array<"otp" | "totp">;
 twoFactorRedirect: boolean;
}

export type SignInTotpInput = z.infer<typeof signInTotpSchema>;
