import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
 createColumnHelper,
 getCoreRowModel,
 getSortedRowModel,
 useReactTable,
 type SortingState,
} from "@tanstack/react-table";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, TrendingUp, Wallet } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
 fetchBalance,
 fetchOpenOrders,
 fetchPositions,
 queryKeys,
 type Order,
 type Position,
} from "@/shared/api/bybit";
import { Badge, Card, CardHeader, CardTitle, DataTable, Spinner } from "@/shared/ui";
import { listApiKeys } from "@/features/ManageBybitApiKey/api/api-keys.actions.ts";
import type { ApiKeyRecord } from "@/features/ManageBybitApiKey/api/api-keys.schema.ts";

function DashboardOverviewPage() {
 const [activeKey, setActiveKey] = useState<ApiKeyRecord | null>(null);
 const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
 const [keysLoading, setKeysLoading] = useState(true);

 const loadKeys = useCallback(async () => {
  try {
   const data = await listApiKeys();
   setKeys(data);
   setActiveKey(data[0]);
  } catch {
   /* ignore */
  }
  setKeysLoading(false);
 }, []);

 useEffect(() => {
  void loadKeys();
 }, [loadKeys]);

 const balanceQuery = useQuery({
  enabled: !!activeKey,
  queryFn: () => fetchBalance({ data: { apiKeyId: activeKey!.id } }),
  queryKey: queryKeys.balance(activeKey?.id || ""),
  refetchInterval: 30_000,
 });

 const positionsQuery = useQuery({
  enabled: !!activeKey,
  queryFn: () => fetchPositions({ data: { apiKeyId: activeKey!.id } }),
  queryKey: queryKeys.positions(activeKey?.id || ""),
  refetchInterval: 15_000,
 });

 const ordersQuery = useQuery({
  enabled: !!activeKey,
  queryFn: () => fetchOpenOrders({ data: { apiKeyId: activeKey!.id } }),
  queryKey: queryKeys.openOrders(activeKey?.id || ""),
  refetchInterval: 15_000,
 });

 if (keysLoading) {
  return (
   <div className="flex justify-center py-20">
    <Spinner size={32} />
   </div>
  );
 }

 return (
  <div className="space-y-6">
   <div className="flex items-center justify-between">
    <h2 className="text-xl font-bold text-slate-100">Overview</h2>
    {keys.length > 1 && (
     <select
      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm"
      onChange={(e) => setActiveKey(keys.find((k) => k.id === e.target.value) || null)}
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
    <KpiCard
     icon={Wallet}
     label="Total Equity"
     loading={balanceQuery.isLoading}
     value={formatUsd(balanceQuery.data?.totalEquity)}
    />
    <KpiCard
     icon={TrendingUp}
     label="Wallet Balance"
     loading={balanceQuery.isLoading}
     value={formatUsd(balanceQuery.data?.totalWalletBalance)}
    />
    <KpiCard
     icon={ArrowUpRight}
     label="Open Positions"
     loading={positionsQuery.isLoading}
     value={String(positionsQuery.data?.length ?? "-")}
    />
    <KpiCard
     icon={ArrowDownRight}
     label="Open Orders"
     loading={ordersQuery.isLoading}
     value={String(ordersQuery.data?.length ?? "-")}
    />
   </div>

   {(balanceQuery.isError || positionsQuery.isError || ordersQuery.isError) && (
    <Card className="border-red-200 bg-red-50">
     <div className="flex items-center gap-3">
      <AlertTriangle className="size-5 text-red-600" />
      <p className="text-sm text-red-800">
       Failed to load some data. Please check your API key or try again later.
      </p>
     </div>
    </Card>
   )}

   <PositionsTable loading={positionsQuery.isLoading} positions={positionsQuery.data} />
   <OrdersTable loading={ordersQuery.isLoading} orders={ordersQuery.data} />
  </div>
 );
}

function KpiCard({
 icon: Icon,
 label,
 loading,
 value,
}: {
 icon: typeof Wallet;
 label: string;
 loading: boolean;
 value: string;
}) {
 return (
  <Card>
   <div className="flex items-center gap-3">
    <div className="flex size-10 items-center justify-center rounded-lg bg-slate-800">
     <Icon className="size-5 text-teal-400" />
    </div>
    <div>
     <p className="text-xs text-slate-400">{label}</p>
     {loading ? (
      <Spinner className="mt-1" size={16} />
     ) : (
      <p className="text-lg font-bold text-slate-100">{value}</p>
     )}
    </div>
   </div>
  </Card>
 );
}

const posCol = createColumnHelper<Position>();
const positionColumns = [
 posCol.accessor("symbol", { header: "Symbol" }),
 posCol.accessor("side", {
  cell: (info) => (
   <Badge variant={info.getValue() === "Buy" ? "success" : "danger"}>{info.getValue()}</Badge>
  ),
  header: "Side",
 }),
 posCol.accessor("size", { header: "Size" }),
 posCol.accessor("leverage", { cell: (info) => `${info.getValue()}x`, header: "Leverage" }),
 posCol.accessor("avgPrice", { cell: (info) => formatUsd(info.getValue()), header: "Entry" }),
 posCol.accessor("markPrice", { cell: (info) => formatUsd(info.getValue()), header: "Mark" }),
 posCol.accessor("unrealisedPnl", {
  cell: (info) => {
   const val = Number(info.getValue());
   return (
    <span className={val >= 0 ? "text-emerald-600" : "text-red-600"}>
     {formatUsd(info.getValue())}
    </span>
   );
  },
  header: "Unreal. PnL",
 }),
 posCol.accessor("liqPrice", {
  cell: (info) =>
   info.getValue() === "" || info.getValue() === "0" ? "-" : formatUsd(info.getValue()),
  header: "Liq. Price",
 }),
];

function PositionsTable({
 loading,
 positions,
}: {
 loading: boolean;
 positions: Position[] | undefined;
}) {
 const [sorting, setSorting] = useState<SortingState>([]);
 const table = useReactTable({
  columns: positionColumns,
  data: positions || [],
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: setSorting,
  state: { sorting },
 });

 return (
  <Card>
   <CardHeader>
    <CardTitle>Positions</CardTitle>
   </CardHeader>
   <DataTable emptyMessage="No open positions" loading={loading} table={table} />
  </Card>
 );
}

const ordCol = createColumnHelper<Order>();
const orderColumns = [
 ordCol.accessor("symbol", { header: "Symbol" }),
 ordCol.accessor("side", {
  cell: (info) => (
   <Badge variant={info.getValue() === "Buy" ? "success" : "danger"}>{info.getValue()}</Badge>
  ),
  header: "Side",
 }),
 ordCol.accessor("orderType", {
  cell: (info) => <Badge variant="default">{info.getValue()}</Badge>,
  header: "Type",
 }),
 ordCol.accessor("qty", { header: "Qty" }),
 ordCol.accessor("price", { cell: (info) => formatUsd(info.getValue()), header: "Price" }),
 ordCol.accessor("orderStatus", { header: "Status" }),
 ordCol.accessor("createdTime", {
  cell: (info) => new Date(Number(info.getValue())).toLocaleString(),
  header: "Created",
 }),
];

function OrdersTable({ loading, orders }: { loading: boolean; orders: Order[] | undefined }) {
 const [sorting, setSorting] = useState<SortingState>([]);
 const table = useReactTable({
  columns: orderColumns,
  data: orders || [],
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: setSorting,
  state: { sorting },
 });

 return (
  <Card>
   <CardHeader>
    <CardTitle>Open Orders</CardTitle>
    <Link className="text-xs font-medium text-teal-400 no-underline hover:underline" to="/orders">
     View all
    </Link>
   </CardHeader>
   <DataTable emptyMessage="No open orders" loading={loading} table={table} />
  </Card>
 );
}

function formatUsd(value: string | undefined): string {
 if (!value) return "-";
 const num = Number(value);
 if (Number.isNaN(num)) return value;
 return `$${num.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}

export const Route = createFileRoute("/_protected-by-login/_protected-by-bybit/")({
 component: DashboardOverviewPage,
});
