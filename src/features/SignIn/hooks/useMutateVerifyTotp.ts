import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { verifyTotp } from "../api/api";

export const useMutateVerifyTotp = (redirectTo?: string) => {
 const navigate = useNavigate();

 return useMutation({
  mutationFn: verifyTotp,
  mutationKey: ["signIn"],
  onSuccess: async () => {
   await navigate({ to: redirectTo ?? "/" });
  },
 });
};
