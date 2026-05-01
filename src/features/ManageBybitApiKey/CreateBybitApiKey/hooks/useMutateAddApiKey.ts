import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createApiKey } from "../api/api-keys.actions.ts";
import { createFormTrigger } from "../ui/ApiKeyAddForm.tsx";
import type { ApiKeyInput } from "../model/schema.ts";

export const useMutateAddApiKey = () => {
 const queryClient = useQueryClient();
 const router = useRouter();

 return useMutation({
  mutationFn: async (values: ApiKeyInput) => {
   return await createApiKey({
    data: values,
   });
  },
  mutationKey: ["bybitApiKey"],
  onError: (error) => {
   console.log("🚀 ~ onError ~ error: ", error);
  },
  onSuccess: async () => {
   await queryClient.invalidateQueries({ queryKey: ["bybitApiKey"] });
   await router.invalidate();
   createFormTrigger.close();
  },
 });
};
