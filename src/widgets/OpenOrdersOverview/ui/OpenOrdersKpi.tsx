import { useRouteContext } from "@tanstack/react-router";
import { ArrowDownRight } from "lucide-react";
import { KpiCard } from "@/shared/ui/KpiCard.tsx";
import { useQueryOpenOrders } from "../hooks/useQueryOpenOrders.ts";

export const OpenOrdersKpi = () => {
 const { selectedApiKeyId } = useRouteContext({
  from: "/_protected-by-login/_protected-by-bybit/",
 });
 const { data, isLoading } = useQueryOpenOrders({ apiKeyId: selectedApiKeyId });

 return (
  <KpiCard
   icon={ArrowDownRight}
   label="Open Orders"
   loading={isLoading}
   value={String(data?.length ?? "-")}
  />
 );
};
