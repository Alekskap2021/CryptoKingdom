import { useMutation } from "@tanstack/react-query";
import { createApiKey } from "../api/api-keys.actions.ts";
import type { ApiKeyInput } from "../model/schema.ts";

export const useMutateAddApiKey = () =>
 useMutation({
  mutationFn: async (values: ApiKeyInput) => {
   return await createApiKey({
    data: values,
   });
  },
  mutationKey: ["bybitApiKey"],
  onError: (error) => {
   console.log("🚀 ~ onError ~ error: ", error);
  },
 });
