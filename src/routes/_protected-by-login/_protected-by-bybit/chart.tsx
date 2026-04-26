import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
 fetchKlines,
 fetchSymbols,
 marketQueryKeys,
 type Kline,
 type SymbolInfo,
} from "@/shared/api/bybit";
import { CandlestickChart, Card, CardHeader, CardTitle, Spinner } from "@/shared/ui";

const INTERVALS = [
 { label: "1m", value: "1" },
 { label: "5m", value: "5" },
 { label: "15m", value: "15" },
 { label: "1H", value: "60" },
 { label: "4H", value: "240" },
 { label: "1D", value: "D" },
 { label: "1W", value: "W" },
] as const;

function ChartPage() {
 const [symbols, setSymbols] = useState<SymbolInfo[]>([]);
 const [symbol, setSymbol] = useState("BTCUSDT");
 const [interval, setInterval] = useState("15");

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

 const klinesQuery = useQuery<Kline[]>({
  queryFn: () => fetchKlines({ data: { interval, symbol } }),
  queryKey: marketQueryKeys.klines(symbol, interval),
  refetchInterval: 60_000,
 });

 return (
  <div className="space-y-4">
   <div className="flex flex-wrap items-center justify-between gap-3">
    <h2 className="text-xl font-bold text-slate-100">Chart</h2>
    <div className="flex items-center gap-2">
     <select
      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm"
      onChange={(e) => setSymbol(e.target.value)}
      value={symbol}>
      {symbols.length > 0 ? (
       symbols.map((s) => (
        <option key={s.symbol} value={s.symbol}>
         {s.symbol}
        </option>
       ))
      ) : (
       <option value={symbol}>{symbol}</option>
      )}
     </select>
     <div className="flex rounded-lg border border-slate-700 bg-slate-900">
      {INTERVALS.map((iv) => (
       <button
        className={`px-3 py-1.5 text-xs font-medium transition ${
         iv.value === interval ? `bg-teal-600 text-white` : `text-slate-400 hover:text-slate-100`
        } first:rounded-l-lg last:rounded-r-lg`}
        key={iv.value}
        onClick={() => setInterval(iv.value)}
        type="button">
        {iv.label}
       </button>
      ))}
     </div>
    </div>
   </div>

   <Card>
    <CardHeader>
     <CardTitle>
      {symbol} — {INTERVALS.find((iv) => iv.value === interval)?.label}
     </CardTitle>
    </CardHeader>
    {klinesQuery.isLoading ? (
     <div className="flex justify-center py-20">
      <Spinner size={32} />
     </div>
    ) : // eslint-disable-next-line sonarjs/no-nested-conditional
    klinesQuery.isError ? (
     <p className="py-8 text-center text-sm text-red-600">Failed to load chart data</p>
    ) : (
     <CandlestickChart data={klinesQuery.data || []} />
    )}
   </Card>
  </div>
 );
}

export const Route = createFileRoute("/_protected-by-login/_protected-by-bybit/chart")({
 component: ChartPage,
});
