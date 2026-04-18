import { z } from "zod";

export const loginSchema = z.object({
 email: z.email("Please enter a valid email address"),
 password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
 .object({
  email: z.email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  passwordConfirm: z.string().min(8, "Please confirm your password"),
 })
 .refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords do not match",
  path: ["passwordConfirm"],
 });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
