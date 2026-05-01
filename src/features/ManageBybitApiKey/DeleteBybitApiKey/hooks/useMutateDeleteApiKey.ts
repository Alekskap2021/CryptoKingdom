import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { deleteApiKey } from "../api/api-keys.actions";
import { deleteKeyTrigger } from "../ui/ApiKeyDeleteForm.tsx";

export const useMutateDeleteApiKey = () => {
 const queryClient = useQueryClient();
 const router = useRouter();

 return useMutation({
  mutationFn: async (id: string) => {
   return await deleteApiKey({ data: { id } });
  },
  mutationKey: ["bybitApiKey"],
  onError: (error) => {
   console.log("🚀 ~ onError ~ error: ", error);
  },
  onSuccess: async () => {
   await queryClient.invalidateQueries({ queryKey: ["bybitApiKey"] });
   await router.invalidate();
   deleteKeyTrigger.close();
  },
 });
};
