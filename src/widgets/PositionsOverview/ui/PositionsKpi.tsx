import { ArrowUpRight } from "lucide-react";
import { KpiCard } from "@/shared/ui/KpiCard.tsx";
import { useQueryPositions } from "../hooks/useQueryPositions.ts";

interface PositionsKpiProps {
 apiKeyId?: string;
}

export const PositionsKpi = (props: PositionsKpiProps) => {
 const { apiKeyId } = props;

 const { data, isLoading } = useQueryPositions({ apiKeyId });

 return (
  <KpiCard
   icon={ArrowUpRight}
   label="Open Positions"
   loading={isLoading}
   value={String(data?.length ?? "-")}
  />
 );
};
