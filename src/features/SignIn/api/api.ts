import { authClient } from "@/shared/auth";
import type { SignInInput, SignInTotpInput } from "../model/signIn.ts";

export const signInApi = async (data: SignInInput) => {
 return await authClient.signIn.email(data);
};

export const verifyTotp = async (data: SignInTotpInput) => {
 return await authClient.twoFactor.verifyTotp(data);
};
