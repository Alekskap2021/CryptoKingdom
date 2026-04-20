import { Wallet } from "lucide-react";
import { formatUsd } from "@/shared/helpers/formatUsd.ts";
import { KpiCard } from "@/shared/ui/KpiCard.tsx";
import { useQueryTotalEquity } from "../hooks/useQueryTotalEquity.ts";

interface TotalEquityProps {
 apiKeyId?: string;
}

export const TotalEquity = (props: TotalEquityProps) => {
 const { apiKeyId } = props;

 const { data, isLoading } = useQueryTotalEquity({ apiKeyId });

 return (
  <KpiCard
   icon={Wallet}
   label="Total Equity"
   loading={isLoading}
   value={formatUsd(data?.totalEquity)}
  />
 );
};
