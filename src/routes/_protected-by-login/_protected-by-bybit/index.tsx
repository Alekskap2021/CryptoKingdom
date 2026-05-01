import { createFileRoute } from "@tanstack/react-router";
import { OpenOrdersKpi, OpenOrdersTable } from "@/widgets/OpenOrdersOverview";
import { PositionsKpi, PositionsTable } from "@/widgets/PositionsOverview";
import { TotalEquity } from "@/widgets/TotalEquity";
import { WalletBalance } from "@/widgets/WalletBalance";

function DashboardOverviewPage() {
 return (
  <div className="space-y-6">
   <div className="flex items-center justify-between">
    <h2 className="text-xl font-bold text-slate-100">Overview</h2>
   </div>

   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <TotalEquity />
    <WalletBalance />
    <PositionsKpi />
    <OpenOrdersKpi />
   </div>

   <PositionsTable />
   <OpenOrdersTable />
  </div>
 );
}

export const Route = createFileRoute("/_protected-by-login/_protected-by-bybit/")({
 component: DashboardOverviewPage,
});
