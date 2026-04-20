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
import { useQueryPositions } from "../hooks/useQueryPositions.ts";
import type { Position } from "../model/positionSchema.ts";

const positionColumn = createColumnHelper<Position>();

const positionColumns = [
 positionColumn.accessor("symbol", { header: "Symbol" }),
 positionColumn.accessor("side", {
  cell: (info) => (
   <Badge variant={info.getValue() === "Buy" ? "success" : "danger"}>{info.getValue()}</Badge>
  ),
  header: "Side",
 }),
 positionColumn.accessor("size", { header: "Size" }),
 positionColumn.accessor("leverage", {
  cell: (info) => `${info.getValue()}x`,
  header: "Leverage",
 }),
 positionColumn.accessor("avgPrice", {
  cell: (info) => formatUsd(info.getValue()),
  header: "Entry",
 }),
 positionColumn.accessor("markPrice", {
  cell: (info) => formatUsd(info.getValue()),
  header: "Mark",
 }),
 positionColumn.accessor("unrealisedPnl", {
  cell: (info) => {
   const value = Number(info.getValue());

   return (
    <span className={value >= 0 ? "text-emerald-600" : "text-red-600"}>
     {formatUsd(info.getValue())}
    </span>
   );
  },
  header: "Unreal. PnL",
 }),
 positionColumn.accessor("liqPrice", {
  cell: (info) => {
   const value = info.getValue();

   return value === "" || value === "0" ? "-" : formatUsd(value);
  },
  header: "Liq. Price",
 }),
];

interface PositionsTableProps {
 apiKeyId?: string;
}

export const PositionsTable = (props: PositionsTableProps) => {
 const { apiKeyId } = props;
 const [sorting, setSorting] = useState<SortingState>([]);
 const { data, isError, isLoading } = useQueryPositions({ apiKeyId });

 const table = useReactTable({
  columns: positionColumns,
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
     <p className="text-sm text-red-800">Failed to load positions. Please try again later.</p>
    </div>
   </Card>
  );
 }

 return (
  <Card>
   <CardHeader>
    <CardTitle>Positions</CardTitle>
   </CardHeader>
   <DataTable emptyMessage="No open positions" loading={isLoading} table={table} />
  </Card>
 );
};
