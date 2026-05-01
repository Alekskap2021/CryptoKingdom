import { ApiKeyAddForm, CreateApiKeyTrigger } from "@/features/ManageBybitApiKey/CreateBybitApiKey";
import { ApiKeyDeleteForm } from "@/features/ManageBybitApiKey/DeleteBybitApiKey";
import { ApiKeyEditForm } from "@/features/ManageBybitApiKey/UpdateBybitApiKey";
import { useQueryApiKeys } from "../hooks/useQueryApiKeys.ts";
import { ApiKeyEmptyPlaceholder } from "./ApiKeyEmptyPlaceholder";
import { ApiKeyList } from "./ApiKeyList";

export const ManageApiKey = () => {
 const { data } = useQueryApiKeys();
 console.log("🚀 ~ ManageApiKey ~ data: ", data);

 return (
  <div className="space-y-6">
   <div className="flex items-center justify-between">
    <div>
     <h2 className="text-xl font-bold text-slate-100">API Keys</h2>
     <p className="text-sm text-slate-400">Manage your Bybit API credentials.</p>
    </div>
    <CreateApiKeyTrigger />
   </div>

   <ApiKeyAddForm />
   <ApiKeyEditForm />
   <ApiKeyDeleteForm />

   {!data || data.length === 0 ? <ApiKeyEmptyPlaceholder /> : null}
   {data && data.length > 0 ? <ApiKeyList keys={data} /> : null}
  </div>
 );
};
