import { useRouteContext } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { formatUsd } from "@/shared/helpers/formatUsd.ts";
import { KpiCard } from "@/shared/ui/KpiCard.tsx";
import { useQueryTotalEquity } from "../hooks/useQueryTotalEquity.ts";

export const TotalEquity = () => {
 const { selectedApiKeyId } = useRouteContext({
  from: "/_protected-by-login/_protected-by-bybit/",
 });
 const { data, isLoading } = useQueryTotalEquity({ apiKeyId: selectedApiKeyId });

 return (
  <KpiCard
   icon={Wallet}
   label="Total Equity"
   loading={isLoading}
   value={formatUsd(data?.totalEquity)}
  />
 );
};
