import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
 createColumnHelper,
 getCoreRowModel,
 getSortedRowModel,
 useReactTable,
 type SortingState,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
 cancelOrder,
 fetchOpenOrders,
 fetchSymbols,
 placeOrder,
 queryKeys,
 type Order,
 type PlaceOrderInput,
 type SymbolInfo,
} from "@/shared/api/bybit";
import {
 Badge,
 Button,
 Card,
 CardHeader,
 CardTitle,
 DataTable,
 Input,
 Label,
 Spinner,
} from "@/shared/ui";
import type { ApiKeyRecord } from "@/features/ManageBybitApiKey";
import { listApiKeys } from "@/features/ManageBybitApiKey";

function OrdersPage() {
 const queryClient = useQueryClient();
 const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
 const [activeKey, setActiveKey] = useState<ApiKeyRecord | null>(null);
 const [keysLoading, setKeysLoading] = useState(true);
 const [symbols, setSymbols] = useState<SymbolInfo[]>([]);
 const [showForm, setShowForm] = useState(false);
 const [formLoading, setFormLoading] = useState(false);
 const [formError, setFormError] = useState<null | string>(null);
 const [formSuccess, setFormSuccess] = useState<null | string>(null);
 const [sorting, setSorting] = useState<SortingState>([]);

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

 useEffect(() => {
  async function load() {
   try {
    const data = await fetchSymbols();
    setSymbols(data.filter((s) => s.status === "Trading"));
   } catch {
    /* ignore */
   }
  }
  void load();
 }, []);

 const ordersQuery = useQuery({
  enabled: !!activeKey,
  queryFn: () => fetchOpenOrders({ data: { apiKeyId: activeKey!.id } }),
  queryKey: queryKeys.openOrders(activeKey?.id || ""),
  refetchInterval: 10_000,
 });

 async function handlePlaceOrder(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setFormError(null);
  setFormSuccess(null);
  setFormLoading(true);

  const fd = new FormData(e.currentTarget);
  const input: PlaceOrderInput = {
   apiKeyId: activeKey!.id,
   orderType: fd.get("orderType") as "Limit" | "Market",
   price: (fd.get("price") as string) || undefined,
   qty: fd.get("qty") as string,
   side: fd.get("side") as "Buy" | "Sell",
   symbol: fd.get("symbol") as string,
  };

  try {
   const result = await placeOrder({ data: input });
   setFormSuccess(`Order placed: ${result.orderId}`);
   setShowForm(false);
   await queryClient.invalidateQueries({ queryKey: queryKeys.openOrders(activeKey!.id) });
  } catch (err) {
   setFormError(err instanceof Error ? err.message : "Failed to place order");
  }
  setFormLoading(false);
 }

 async function handleCancel(orderId: string, symbol: string) {
  if (!activeKey || !confirm("Cancel this order?")) return;
  try {
   await cancelOrder({ data: { apiKeyId: activeKey.id, orderId, symbol } });
   await queryClient.invalidateQueries({ queryKey: queryKeys.openOrders(activeKey.id) });
  } catch {
   /* ignore */
  }
 }

 const ordCol = createColumnHelper<Order>();
 const columns = [
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
  ordCol.accessor("cumExecQty", { header: "Filled" }),
  ordCol.accessor("orderStatus", { header: "Status" }),
  ordCol.accessor("createdTime", {
   cell: (info) => new Date(Number(info.getValue())).toLocaleString(),
   header: "Created",
  }),
  ordCol.display({
   cell: (info) => (
    <Button
     onClick={() => handleCancel(info.row.original.orderId, info.row.original.symbol)}
     size="icon"
     title="Cancel"
     variant="ghost">
     <Trash2 className="text-red-500" size={14} />
    </Button>
   ),
   header: "",
   id: "actions",
  }),
 ];

 const table = useReactTable({
  columns,
  data: ordersQuery.data || [],
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: setSorting,
  state: { sorting },
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
    <h2 className="text-xl font-bold text-slate-100">Orders</h2>
    <div className="flex items-center gap-3">
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
     <Button disabled={!activeKey} onClick={() => setShowForm(!showForm)} size="sm">
      New Order
     </Button>
    </div>
   </div>

   {showForm && activeKey && (
    <Card>
     <CardHeader>
      <CardTitle>Place Order</CardTitle>
     </CardHeader>
     <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" onSubmit={handlePlaceOrder}>
      <div className="space-y-1.5">
       <Label htmlFor="symbol">Symbol</Label>
       <select
        className="flex h-9 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm"
        id="symbol"
        name="symbol"
        required>
        {symbols.map((s) => (
         <option key={s.symbol} value={s.symbol}>
          {s.symbol}
         </option>
        ))}
       </select>
      </div>
      <div className="space-y-1.5">
       <Label htmlFor="side">Side</Label>
       <select
        className="flex h-9 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm"
        id="side"
        name="side">
        <option value="Buy">Buy</option>
        <option value="Sell">Sell</option>
       </select>
      </div>
      <div className="space-y-1.5">
       <Label htmlFor="orderType">Type</Label>
       <select
        className="flex h-9 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm"
        id="orderType"
        name="orderType">
        <option value="Limit">Limit</option>
        <option value="Market">Market</option>
       </select>
      </div>
      <div className="space-y-1.5">
       <Label htmlFor="qty">Quantity</Label>
       <Input id="qty" name="qty" placeholder="0.01" required step="any" type="number" />
      </div>
      <div className="space-y-1.5">
       <Label htmlFor="price">Price (Limit only)</Label>
       <Input id="price" name="price" placeholder="0.00" step="any" type="number" />
      </div>
      <div className="flex items-end gap-2">
       <Button className="flex-1" disabled={formLoading} type="submit">
        {formLoading ? "Placing..." : "Place Order"}
       </Button>
       <Button onClick={() => setShowForm(false)} type="button" variant="ghost">
        Cancel
       </Button>
      </div>
      {formError && <p className="col-span-full text-sm text-red-600">{formError}</p>}
      {formSuccess && <p className="col-span-full text-sm text-emerald-600">{formSuccess}</p>}
     </form>
    </Card>
   )}

   <Card>
    <CardHeader>
     <CardTitle>Open Orders</CardTitle>
    </CardHeader>
    <DataTable emptyMessage="No open orders" loading={ordersQuery.isLoading} table={table} />
   </Card>
  </div>
 );
}

function formatUsd(value: string | undefined): string {
 if (!value) return "-";
 const num = Number(value);
 if (Number.isNaN(num)) return value;
 return `$${num.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}

export const Route = createFileRoute("/_protected-by-login/_protected-by-bybit/orders")({
 component: OrdersPage,
});
