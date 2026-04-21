import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/bybit";
import { placeBybitOrder, type PlaceBybitOrderInput } from "../api/placeBybitOrder.ts";

export const useMutatePlaceBybitOrder = () => {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: async (input: PlaceBybitOrderInput) =>
   placeBybitOrder({
    data: input,
   }),
  mutationKey: ["bybit", "placeOrder"],
  onSuccess: async (_, variables) => {
   await queryClient.invalidateQueries({
    queryKey: queryKeys.openOrders(variables.apiKeyId),
   });
  },
 });
};
