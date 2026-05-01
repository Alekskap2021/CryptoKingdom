import { RadioGroup } from "@base-ui/react/radio-group";
import { useRouter, useRouteContext } from "@tanstack/react-router";
import { SELECTED_API_KEY_STORAGE_KEY } from "@/shared/config/const.ts";
import { cn } from "@/shared/lib/cn.ts";
import { Cookie } from "@/shared/lib/Cookie.ts";
import { Badge, Card } from "@/shared/ui";
import { Radio } from "@/shared/ui/Radio.tsx";
import { DeleteApiKeyTrigger } from "@/features/ManageBybitApiKey/DeleteBybitApiKey";
import { EditApiKeyTrigger } from "@/features/ManageBybitApiKey/UpdateBybitApiKey";
import type { ApiKeyRecord } from "../model/schema.ts";

interface ApiKeyListProps {
 keys: ApiKeyRecord[];
 onRefresh?: () => Promise<void>;
}

export const ApiKeyList = (props: ApiKeyListProps) => {
 const { keys } = props;
 const { selectedApiKeyId } = useRouteContext({
  from: "/_protected-by-login",
 });
 const router = useRouter();

 const handleSelectedKeyChange = async (keyId: string | undefined) => {
  Cookie.set(SELECTED_API_KEY_STORAGE_KEY, keyId ?? "");
  await router.invalidate();
 };

 return (
  <RadioGroup
   className="space-y-3"
   disabled={keys.length === 1}
   value={selectedApiKeyId}
   onValueChange={handleSelectedKeyChange}>
   {keys.map((key) => (
    <Card
     key={key.id}
     className={cn("transition-colors", { "border-teal-400/50": key.id === selectedApiKeyId })}>
     <Radio
      className="flex items-center justify-between gap-4"
      value={key.id}
      disabled={keys.length === 1}>
      <div className="min-w-0 flex-1">
       <p className="truncate text-sm font-medium text-slate-100">{key.label}</p>
       <p className="mt-0.5 font-mono text-xs text-slate-400">{key.maskedKey}</p>
      </div>
      <div className="flex items-center gap-2">
       {key.testnet && <Badge variant="info">Testnet</Badge>}
       <EditApiKeyTrigger id={key.id} />
       <DeleteApiKeyTrigger id={key.id} />
      </div>
     </Radio>
    </Card>
   ))}
  </RadioGroup>
 );
};
