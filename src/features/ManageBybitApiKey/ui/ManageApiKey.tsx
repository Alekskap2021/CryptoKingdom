import { useRouteContext } from "@tanstack/react-router";
import { ApiKeyAddForm, CreateApiKeyTrigger } from "./ApiKeyAddForm";
import { ApiKeyEditForm } from "./ApiKeyEditForm.tsx";
import { ApiKeyEmptyPlaceholder } from "./ApiKeyEmptyPlaceholder";
import { ApiKeyList } from "./ApiKeyList";

export const ManageApiKey = () => {
 const { apiKeysList } = useRouteContext({
  from: "/_protected-by-login",
 });

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

   {apiKeysList.length > 0 ? <ApiKeyList keys={apiKeysList} /> : <ApiKeyEmptyPlaceholder />}
  </div>
 );
};
