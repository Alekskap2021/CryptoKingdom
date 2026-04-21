import { useState, type FormEvent } from "react";
import { Button, Card, CardHeader, CardTitle, Input, Label } from "@/shared/ui";
import { useMutatePlaceBybitOrder } from "../hooks/useMutatePlaceBybitOrder.ts";
import { useQueryTradingSymbols } from "../hooks/useQueryTradingSymbols.ts";
import type { PlaceBybitOrderInput } from "../model/placeBybitOrder.ts";

interface PlaceBybitOrderProps {
 apiKeyId?: string;
}

export const PlaceBybitOrder = (props: PlaceBybitOrderProps) => {
 const { apiKeyId } = props;
 const [isOpen, setIsOpen] = useState(false);
 const [successMessage, setSuccessMessage] = useState<null | string>(null);
 const symbolsQuery = useQueryTradingSymbols();
 const placeOrderMutation = useMutatePlaceBybitOrder();

 async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if (!apiKeyId) {
   return;
  }

  setSuccessMessage(null);

  const formData = new FormData(event.currentTarget);
  const input: PlaceBybitOrderInput = {
   apiKeyId,
   orderType: formData.get("orderType") as "Limit" | "Market",
   price: (formData.get("price") as string) || undefined,
   qty: formData.get("qty") as string,
   side: formData.get("side") as "Buy" | "Sell",
   symbol: formData.get("symbol") as string,
  };

  try {
   const result = await placeOrderMutation.mutateAsync(input);
   setIsOpen(false);
   setSuccessMessage(`Order placed: ${result.orderId}`);
   event.currentTarget.reset();
  } catch {
   // Error text is rendered from mutation state.
  }
 }

 const tradingSymbols = symbolsQuery.data?.filter((symbol) => symbol.status === "Trading") ?? [];

 return (
  <div className="space-y-4">
   <div className="flex items-center gap-3">
    <Button disabled={!apiKeyId} onClick={() => setIsOpen((current) => !current)} size="sm">
     New Order
    </Button>
    {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}
   </div>

   {isOpen && apiKeyId && (
    <Card>
     <CardHeader>
      <CardTitle>Place Order</CardTitle>
     </CardHeader>
     <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
       <Label htmlFor="symbol">Symbol</Label>
       <select
        className="flex h-9 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm"
        disabled={symbolsQuery.isLoading}
        id="symbol"
        name="symbol"
        required>
        {tradingSymbols.map((symbol) => (
         <option key={symbol.symbol} value={symbol.symbol}>
          {symbol.symbol}
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
       <Button className="flex-1" disabled={placeOrderMutation.isPending} type="submit">
        {placeOrderMutation.isPending ? "Placing..." : "Place Order"}
       </Button>
       <Button onClick={() => setIsOpen(false)} type="button" variant="ghost">
        Cancel
       </Button>
      </div>

      {symbolsQuery.isError && (
       <p className="col-span-full text-sm text-red-600">Failed to load trading symbols.</p>
      )}
      {placeOrderMutation.isError && (
       <p className="col-span-full text-sm text-red-600">
        {placeOrderMutation.error instanceof Error
         ? placeOrderMutation.error.message
         : "Failed to place order"}
       </p>
      )}
     </form>
    </Card>
   )}
  </div>
 );
};
