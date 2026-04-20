import { ArrowDownRight } from "lucide-react";
import { KpiCard } from "@/shared/ui/KpiCard.tsx";
import { useQueryOpenOrders } from "../hooks/useQueryOpenOrders.ts";

interface OpenOrdersKpiProps {
 apiKeyId?: string;
}

export const OpenOrdersKpi = (props: OpenOrdersKpiProps) => {
 const { apiKeyId } = props;

 const { data, isLoading } = useQueryOpenOrders({ apiKeyId });

 return (
  <KpiCard
   icon={ArrowDownRight}
   label="Open Orders"
   loading={isLoading}
   value={String(data?.length ?? "-")}
  />
 );
};
