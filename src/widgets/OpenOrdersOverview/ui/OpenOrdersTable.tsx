import { Link, useRouteContext } from "@tanstack/react-router";
import {
 createColumnHelper,
 getCoreRowModel,
 getSortedRowModel,
 useReactTable,
 type SortingState,
} from "@tanstack/react-table";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { formatUsd } from "@/shared/helpers/formatUsd.ts";
import { Badge, Card, CardHeader, CardTitle, DataTable } from "@/shared/ui";
import { useQueryOpenOrders } from "../hooks/useQueryOpenOrders.ts";
import type { Order } from "../model/orderSchema.ts";

const orderColumn = createColumnHelper<Order>();

const orderColumns = [
 orderColumn.accessor("symbol", { header: "Symbol" }),
 orderColumn.accessor("side", {
  cell: (info) => (
   <Badge variant={info.getValue() === "Buy" ? "success" : "danger"}>{info.getValue()}</Badge>
  ),
  header: "Side",
 }),
 orderColumn.accessor("orderType", {
  cell: (info) => <Badge variant="default">{info.getValue()}</Badge>,
  header: "Type",
 }),
 orderColumn.accessor("qty", { header: "Qty" }),
 orderColumn.accessor("price", {
  cell: (info) => formatUsd(info.getValue()),
  header: "Price",
 }),
 orderColumn.accessor("orderStatus", { header: "Status" }),
 orderColumn.accessor("createdTime", {
  cell: (info) => new Date(Number(info.getValue())).toLocaleString(),
  header: "Created",
 }),
];

export const OpenOrdersTable = () => {
 const { selectedApiKeyId } = useRouteContext({
  from: "/_protected-by-login/_protected-by-bybit/",
 });

 const [sorting, setSorting] = useState<SortingState>([]);
 const { data, isError, isLoading } = useQueryOpenOrders({ apiKeyId: selectedApiKeyId });

 const table = useReactTable({
  columns: orderColumns,
  data: data ?? [],
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: setSorting,
  state: { sorting },
 });

 if (isError) {
  return (
   <Card className="border-red-200 bg-red-50">
    <div className="flex items-center gap-3">
     <AlertTriangle className="size-5 text-red-600" />
     <p className="text-sm text-red-800">Failed to load open orders. Please try again later.</p>
    </div>
   </Card>
  );
 }

 return (
  <Card>
   <CardHeader>
    <CardTitle>Open Orders</CardTitle>
    <Link className="text-xs font-medium text-teal-400 no-underline hover:underline" to="/orders">
     View all
    </Link>
   </CardHeader>
   <DataTable emptyMessage="No open orders" loading={isLoading} table={table} />
  </Card>
 );
};
