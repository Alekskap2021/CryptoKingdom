import { cn } from "../lib/cn";
import type { Kline } from "../api/bybit/types";

interface CandlestickChartProps {
 className?: string;
 data: Kline[];
 height?: number;
}

export function CandlestickChart({ className, height = 400 }: CandlestickChartProps) {
 // const containerRef = useRef<HTMLDivElement>(null);
 // const chartRef = useRef<IChartApi | null>(null);
 // const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
 // const [ready, setReady] = useState(false);
 //
 // useEffect(() => {
 //  if (!containerRef.current) return;
 //
 //  const chart = createChart(containerRef.current, {
 //   autoSize: true,
 //   grid: {
 //    horzLines: { color: "rgba(23, 58, 64, 0.08)" },
 //    vertLines: { color: "rgba(23, 58, 64, 0.08)" },
 //   },
 //   layout: {
 //    background: { color: "transparent", type: ColorType.Solid },
 //    textColor: "#416166",
 //   },
 //  });
 //
 //  const series = chart.addCandlestickSeries({
 //   downColor: "#ef4444",
 //   upColor: "#10b981",
 //   wickDownColor: "#ef4444",
 //   wickUpColor: "#10b981",
 //  });
 //
 //  chartRef.current = chart;
 //  seriesRef.current = series;
 //  setReady(true);
 //
 //  return () => {
 //   chart.remove();
 //   chartRef.current = null;
 //   seriesRef.current = null;
 //  };
 // }, []);
 //
 // useEffect(() => {
 //  if (!seriesRef.current || !ready || data.length === 0) return;
 //
 //  const candleData: CandlestickData<Time>[] = data
 //   .map((k) => ({
 //    close: Number(k.close),
 //    high: Number(k.high),
 //    low: Number(k.low),
 //    open: Number(k.open),
 //    time: (k.timestamp / 1000) as Time,
 //   }))
 //   .sort((a, b) => (a.time as number) - (b.time as number));
 //
 //  seriesRef.current.setData(candleData);
 //  chartRef.current?.timeScale().fitContent();
 // }, [data, ready]);

 return (
  <div
   className={cn("w-full overflow-hidden rounded-lg", className)}
   // ref={containerRef}
   style={{ height }}
  />
 );
}
