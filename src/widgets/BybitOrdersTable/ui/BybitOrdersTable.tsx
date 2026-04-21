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
import { CancelBybitOrderButton } from "@/features/CancelBybitOrder";
import { useQueryBybitOrders } from "../hooks/useQueryBybitOrders.ts";
import type { Order } from "../model/orderSchema.ts";

const orderColumn = createColumnHelper<Order>();

const orderColumns = (apiKeyId: string) => [
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
 orderColumn.accessor("cumExecQty", { header: "Filled" }),
 orderColumn.accessor("orderStatus", { header: "Status" }),
 orderColumn.accessor("createdTime", {
  cell: (info) => new Date(Number(info.getValue())).toLocaleString(),
  header: "Created",
 }),
 orderColumn.display({
  cell: (info) => (
   <CancelBybitOrderButton
    apiKeyId={apiKeyId}
    orderId={info.row.original.orderId}
    symbol={info.row.original.symbol}
   />
  ),
  header: "",
  id: "actions",
 }),
];

interface BybitOrdersTableProps {
 apiKeyId?: string;
}

export const BybitOrdersTable = (props: BybitOrdersTableProps) => {
 const { apiKeyId } = props;
 const [sorting, setSorting] = useState<SortingState>([]);
 const ordersQuery = useQueryBybitOrders({ apiKeyId });

 const table = useReactTable({
  columns: apiKeyId ? orderColumns(apiKeyId) : [],
  data: ordersQuery.data ?? [],
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: setSorting,
  state: { sorting },
 });

 if (ordersQuery.isError) {
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
   </CardHeader>
   <DataTable emptyMessage="No open orders" loading={ordersQuery.isLoading} table={table} />
  </Card>
 );
};
