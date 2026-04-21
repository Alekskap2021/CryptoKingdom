import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/bybit";
import { cancelBybitOrder, type CancelBybitOrderInput } from "../api/cancelBybitOrder.ts";

export const useMutateCancelBybitOrder = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async (input: CancelBybitOrderInput) =>
   cancelBybitOrder({
    data: input,
   }),
  mutationKey: ["bybit", "cancelOrder"],
  onSuccess: async (_, variables) => {
   await queryClient.invalidateQueries({
    queryKey: queryKeys.openOrders(variables.apiKeyId),
   });
  },
 });
};
