import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, Spinner } from "@/shared/ui";
import { type ApiKeyRecord, useQueryApiKeys } from "@/features/ManageBybitApiKey";
import { PlaceBybitOrder } from "@/features/PlaceBybitOrder";
import { BybitOrdersTable } from "@/widgets/BybitOrdersTable";
import { BybitOrdersToolbar } from "@/widgets/BybitOrdersToolbar";

function OrdersPage() {
 const [activeKeyId, setActiveKeyId] = useState<null | string>(null);
 const keysQuery = useQueryApiKeys();

 const keys = keysQuery.data ?? [];
 const activeKey = useMemo<ApiKeyRecord | null>(() => {
  if (!keys.length) {
   return null;
  }

  return keys.find((key) => key.id === activeKeyId) ?? keys[0];
 }, [activeKeyId, keys]);

 if (keysQuery.isLoading) {
  return (
   <div className="flex justify-center py-20">
    <Spinner size={32} />
   </div>
  );
 }

 return (
  <div className="space-y-6">
   {keysQuery.isError && (
    <Card className="border-red-200 bg-red-50">
     <p className="text-sm text-red-800">
      Failed to load API keys. Please refresh the page and try again.
     </p>
    </Card>
   )}

   <BybitOrdersToolbar
    actions={<PlaceBybitOrder apiKeyId={activeKey?.id} />}
    activeKeyId={activeKey?.id}
    keys={keys}
    onActiveKeyChange={setActiveKeyId}
   />

   <BybitOrdersTable apiKeyId={activeKey?.id} />
  </div>
 );
}

export const Route = createFileRoute("/_protected-by-login/_protected-by-bybit/orders")({
 component: OrdersPage,
});
