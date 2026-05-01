import { useRouteContext } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { KpiCard } from "@/shared/ui/KpiCard.tsx";
import { useQueryPositions } from "../hooks/useQueryPositions.ts";

export const PositionsKpi = () => {
 const { selectedApiKeyId } = useRouteContext({
  from: "/_protected-by-login/_protected-by-bybit/",
 });
 const { data, isLoading } = useQueryPositions({ apiKeyId: selectedApiKeyId });

 return (
  <KpiCard
   icon={ArrowUpRight}
   label="Open Positions"
   loading={isLoading}
   value={String(data?.length ?? "-")}
  />
 );
};
