import { Wallet } from "lucide-react";
import { Card } from "./card.tsx";
import { Spinner } from "./spinner.tsx";

interface KpiCardProps {
 icon: typeof Wallet;
 label: string;
 loading: boolean;
 value: string;
}

export const KpiCard = (props: KpiCardProps) => {
 const { icon: Icon, label, loading, value } = props;

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
};
