import { useRouteContext } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { formatUsd } from "@/shared/helpers/formatUsd.ts";
import { KpiCard } from "@/shared/ui/KpiCard.tsx";
import { useQueryUserBalance } from "../hooks/useQueryUserBalance.ts";

export const WalletBalance = () => {
 const { selectedApiKeyId } = useRouteContext({
  from: "/_protected-by-login/_protected-by-bybit/",
 });

 const { data, isLoading } = useQueryUserBalance({ apiKeyId: selectedApiKeyId });

 return (
  <KpiCard
   icon={TrendingUp}
   label="Wallet Balance"
   loading={isLoading}
   value={formatUsd(data?.totalWalletBalance)}
  />
 );
};
