import { useRouteContext } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/ui";
import { ApiKeyAddForm } from "./ApiKeyAddForm";
import { ApiKeyEmptyPlaceholder } from "./ApiKeyEmptyPlaceholder";
import { ApiKeyList } from "./ApiKeyList";

export const ManageApiKey = () => {
 const { apiKeysList } = useRouteContext({
  from: "/_protected-by-login",
 });

 const [showForm, setShowForm] = useState(false);

 return (
  <div className="space-y-6">
   <div className="flex items-center justify-between">
    <div>
     <h2 className="text-xl font-bold text-slate-100">API Keys</h2>
     <p className="text-sm text-slate-400">Manage your Bybit API credentials.</p>
    </div>
    {!showForm && (
     <Button onClick={() => setShowForm(true)} size="sm">
      <Plus size={16} />
      Add Key
     </Button>
    )}
   </div>

   <ApiKeyAddForm onCancel={() => setShowForm(false)} />

   {apiKeysList.length > 0 ? <ApiKeyList keys={apiKeysList} /> : <ApiKeyEmptyPlaceholder />}
  </div>
 );
};
