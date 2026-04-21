import type { ApiKeyRecord } from "@/features/ManageBybitApiKey";
import type { ReactNode } from "react";

interface BybitOrdersToolbarProps {
 actions?: ReactNode;
 activeKeyId?: string;
 keys: ApiKeyRecord[];
 onActiveKeyChange: (apiKeyId: string) => void;
}

export const BybitOrdersToolbar = (props: BybitOrdersToolbarProps) => {
 const { actions, activeKeyId, keys, onActiveKeyChange } = props;

 return (
  <div className="flex items-center justify-between">
   <h2 className="text-xl font-bold text-slate-100">Orders</h2>
   <div className="flex items-center gap-3">
    {keys.length > 1 && (
     <select
      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm"
      onChange={(event) => onActiveKeyChange(event.target.value)}
      value={activeKeyId}>
      {keys.map((key) => (
       <option key={key.id} value={key.id}>
        {key.label}
       </option>
      ))}
     </select>
    )}
    {actions}
   </div>
  </div>
 );
};
