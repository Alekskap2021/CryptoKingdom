import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { updateApiKey } from "../api/api-keys.actions.ts";
import type { ApiKeyUpdateInput } from "../model/schema.ts";

export const useMutateEditApiKey = () => {
 const navigate = useNavigate({ from: "/api-keys" });

 return useMutation({
  mutationFn: async (updateInput: ApiKeyUpdateInput & { id: string }) => {
   return await updateApiKey({ data: updateInput });
  },
  mutationKey: ["bybitApiKey"],
  onError: (error) => {
   console.log("🚀 ~ onError ~ error: ", error);
  },
  onSuccess: async () => {
   navigate({ search: { apiKeyId: undefined }, to: "." });
  },
 });
};
