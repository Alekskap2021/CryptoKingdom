import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import {
 createColumnHelper,
 getCoreRowModel,
 getSortedRowModel,
 useReactTable,
 type SortingState,
} from "@tanstack/react-table";
import { Download } from "lucide-react";
import { useState } from "react";
import { exportTradesCsv, fetchExecutions, queryKeys, type Execution } from "@/shared/api/bybit";
import { Badge, Button, Card, CardHeader, CardTitle, DataTable, Input } from "@/shared/ui";

function HistoryPage() {
 const { selectedApiKeyId } = useRouteContext({
  from: "/_protected-by-login",
 });

 const [symbolFilter, setSymbolFilter] = useState("");
 const [sorting, setSorting] = useState<SortingState>([]);
 const [exporting, setExporting] = useState(false);

 const executionsQuery = useQuery({
  enabled: !!selectedApiKeyId,
  queryFn: () =>
   fetchExecutions({
    data: {
     apiKeyId: selectedApiKeyId,
     limit: 100,
     symbol: symbolFilter || undefined,
    },
   }),
  queryKey: queryKeys.executions(selectedApiKeyId || "", { symbol: symbolFilter || undefined }),
  refetchInterval: 30_000,
 });

 const execCol = createColumnHelper<Execution>();
 const columns = [
  execCol.accessor("symbol", { header: "Symbol" }),
  execCol.accessor("side", {
   cell: (info) => (
    <Badge variant={info.getValue() === "Buy" ? "success" : "danger"}>{info.getValue()}</Badge>
   ),
   header: "Side",
  }),
  execCol.accessor("orderType", { header: "Type" }),
  execCol.accessor("execQty", { header: "Qty" }),
  execCol.accessor("execPrice", { cell: (info) => formatUsd(info.getValue()), header: "Price" }),
  execCol.accessor("execValue", { cell: (info) => formatUsd(info.getValue()), header: "Value" }),
  execCol.accessor("execFee", { cell: (info) => formatUsd(info.getValue()), header: "Fee" }),
  execCol.accessor("execTime", {
   cell: (info) => new Date(Number(info.getValue())).toLocaleString(),
   header: "Time",
  }),
 ];

 const table = useReactTable({
  columns,
  data: executionsQuery.data?.list || [],
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: setSorting,
  state: { sorting },
 });

 return (
  <div className="space-y-6">
   <div className="flex flex-wrap items-center justify-between gap-3">
    <h2 className="text-xl font-bold text-slate-100">Trade History</h2>
    <div className="flex items-center gap-2">
     <Input
      className="w-40"
      onChange={(e) => setSymbolFilter(e.target.value)}
      placeholder="Filter by symbol..."
      value={symbolFilter}
     />
     <Button
      disabled={exporting || !selectedApiKeyId}
      onClick={async () => {
       if (!selectedApiKeyId) return;
       setExporting(true);
       try {
        const csv = await exportTradesCsv({
         data: { apiKeyId: selectedApiKeyId, symbol: symbolFilter || undefined },
        });
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `trades-${symbolFilter || "all"}-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
       } catch {
        /* ignore */
       }
       setExporting(false);
      }}
      size="sm"
      variant="secondary">
      <Download size={14} />
      {exporting ? "Exporting..." : "CSV"}
     </Button>
    </div>
   </div>

   <Card>
    <CardHeader>
     <CardTitle>Executions</CardTitle>
    </CardHeader>
    <DataTable emptyMessage="No trades found" loading={executionsQuery.isLoading} table={table} />
   </Card>
  </div>
 );
}

function formatUsd(value: string | undefined): string {
 if (!value) return "-";
 const num = Number(value);
 if (Number.isNaN(num)) return value;
 return `$${num.toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 2 })}`;
}

export const Route = createFileRoute("/_protected-by-login/_protected-by-bybit/history")({
 component: HistoryPage,
});
