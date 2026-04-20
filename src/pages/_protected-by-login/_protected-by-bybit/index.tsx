import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, Spinner } from "@/shared/ui";
import { listApiKeys, type ApiKeyRecord } from "@/features/ManageBybitApiKey";
import { OpenOrdersKpi, OpenOrdersTable } from "@/widgets/OpenOrdersOverview";
import { PositionsKpi, PositionsTable } from "@/widgets/PositionsOverview";
import { TotalEquity } from "@/widgets/TotalEquity";
import { WalletBalance } from "@/widgets/WalletBalance";

function DashboardOverviewPage() {
 const [activeKeyId, setActiveKeyId] = useState<null | string>(null);
 const keysQuery = useQuery({
  queryFn: listApiKeys,
  queryKey: ["bybit", "apiKeys"],
 });

 const keys = keysQuery.data ?? [];
 const activeKey = useMemo<ApiKeyRecord | null>(() => {
  if (!keys.length) {
   return null;
  }

  return keys.find((key) => key.id === activeKeyId) ?? keys[0];
 }, [activeKeyId, keys]);

 if (keysQuery.isLoading) {
  return (
   <div className="flex justify-center py-20">
    <Spinner size={32} />
   </div>
  );
 }

 return (
  <div className="space-y-6">
   {keysQuery.isError && (
    <Card className="border-red-200 bg-red-50">
     <p className="text-sm text-red-800">
      Failed to load API keys. Please refresh the page and try again.
     </p>
    </Card>
   )}

   <div className="flex items-center justify-between">
    <h2 className="text-xl font-bold text-slate-100">Overview</h2>
    {keys.length > 1 && (
     <select
      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm"
      onChange={(e) => setActiveKeyId(e.target.value)}
      value={activeKey?.id}>
      {keys.map((k) => (
       <option key={k.id} value={k.id}>
        {k.label}
       </option>
      ))}
     </select>
    )}
   </div>

   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <TotalEquity apiKeyId={activeKey?.id} />
    <WalletBalance apiKeyId={activeKey?.id} />
    <PositionsKpi apiKeyId={activeKey?.id} />
    <OpenOrdersKpi apiKeyId={activeKey?.id} />
   </div>

   <PositionsTable apiKeyId={activeKey?.id} />
   <OpenOrdersTable apiKeyId={activeKey?.id} />
  </div>
 );
}

export const Route = createFileRoute("/_protected-by-login/_protected-by-bybit/")({
 component: DashboardOverviewPage,
});
