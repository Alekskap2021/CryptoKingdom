import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signInApi } from "../api/api";
import { hasTwoFactorRedirect } from "../helpers/hasTwoFactorRedirect";

export const useMutateSignIn = (redirectTo?: string) => {
 const navigate = useNavigate();

 return useMutation({
  mutationFn: signInApi,
  mutationKey: ["signIn"],
  onSuccess: async ({ data }) => {
   console.log("🚀 ~ onSuccess ~ data: ", data);
   if (hasTwoFactorRedirect(data)) {
    console.log("🚀 ~ 2FA enabled ");
    await navigate({
     search: { redirect: redirectTo, twoFactorMethod: data.twoFactorMethods[0] },
     to: "/two-factor-verify",
    });
   } else {
    await navigate({ to: redirectTo ?? "/" });
   }
  },
 });
};
