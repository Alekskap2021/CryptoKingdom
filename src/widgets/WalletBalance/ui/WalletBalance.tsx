import { TrendingUp } from "lucide-react";
import { formatUsd } from "@/shared/helpers/formatUsd.ts";
import { KpiCard } from "@/shared/ui/KpiCard.tsx";
import { useQueryUserBalance } from "../hooks/useQueryUserBalance.ts";

interface WalletBalanceProps {
 apiKeyId?: string;
}

export const WalletBalance = (props: WalletBalanceProps) => {
 const { apiKeyId } = props;

 const { data, isLoading } = useQueryUserBalance({ apiKeyId });

 return (
  <KpiCard
   icon={TrendingUp}
   label="Wallet Balance"
   loading={isLoading}
   value={formatUsd(data?.totalWalletBalance)}
  />
 );
};
