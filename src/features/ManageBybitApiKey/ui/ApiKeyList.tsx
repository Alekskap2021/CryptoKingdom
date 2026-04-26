import { RadioGroup } from "@base-ui/react/radio-group";
import { Link, useRouteContext } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/cn.ts";
import { Cookie } from "@/shared/lib/Cookie.ts";
import { Badge, Button, Card } from "@/shared/ui";
import { Radio } from "@/shared/ui/Radio.tsx";
import { deleteApiKey } from "../api/api-keys.actions.ts";
import { SELECTED_API_KEY_STORAGE_KEY } from "../config/const.ts";
import type { ApiKeyRecord } from "../model/schema.ts";

interface ApiKeyListProps {
 keys: ApiKeyRecord[];
 onRefresh?: () => Promise<void>;
}

export const ApiKeyList = (props: ApiKeyListProps) => {
 const { keys, onRefresh } = props;
 const [error, setError] = useState<null | string>(null);
 const { selectedApiKeyId } = useRouteContext({
  from: "/_protected-by-login",
 });

 const [selectedKey, setSelectedKey] = useState(selectedApiKeyId);

 const handleSelectedKeyChange = (keyId: string | undefined) => {
  setSelectedKey(keyId);
  Cookie.set(SELECTED_API_KEY_STORAGE_KEY, keyId ?? "");
 };

 async function handleDelete(id: string) {
  if (!confirm("Are you sure you want to delete this API key?")) return;
  setError(null);
  try {
   await deleteApiKey({ data: { id } });
   await onRefresh?.();
  } catch (err) {
   setError(err instanceof Error ? err.message : "Failed to delete key.");
  }
 }

 return (
  <>
   {error && <p className="text-sm text-red-600">{error}</p>}
   <RadioGroup
    className="space-y-3"
    disabled={keys.length === 1}
    value={selectedKey}
    onValueChange={handleSelectedKeyChange}>
    {keys.map((key) => (
     <Card
      key={key.id}
      className={cn("transition-colors", { "border-teal-400/50": key.id === selectedKey })}>
      <Radio
       className="peer flex items-center justify-between gap-4"
       value={key.id}
       disabled={keys.length === 1}>
       <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-100">{key.label}</p>
        <p className="mt-0.5 font-mono text-xs text-slate-400">{key.maskedKey}</p>
       </div>
       <div className="flex items-center gap-2">
        {key.testnet && <Badge variant="info">Testnet</Badge>}

        <Button
         size="icon"
         title="Edit label"
         variant="ghost"
         nativeButton={false}
         render={
          <Link to="." search={{ apiKeyId: key.id }}>
           <Pencil size={16} />
          </Link>
         }
        />

        <Button onClick={() => handleDelete(key.id)} size="icon" title="Delete" variant="ghost">
         <Trash2 className="text-red-500" size={16} />
        </Button>
       </div>
      </Radio>
     </Card>
    ))}
   </RadioGroup>
  </>
 );
};
