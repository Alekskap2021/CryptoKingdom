import { createFileRoute } from "@tanstack/react-router";
// import { useMemo, useState } from "react";
// import { Card, Spinner } from "@/shared/ui";
// import { type ApiKeyRecord, useQueryApiKeys } from "@/features/ManageBybitApiKey";
// import { PlaceBybitOrder } from "@/features/PlaceBybitOrder";
// import { BybitOrdersTable } from "@/widgets/BybitOrdersTable";
// import { BybitOrdersToolbar } from "@/widgets/BybitOrdersToolbar";

function OrdersPage() {
 return (
  <div className="space-y-6">
   {/*<BybitOrdersToolbar*/}
   {/* actions={<PlaceBybitOrder apiKeyId={activeKey?.id} />}*/}
   {/* activeKeyId={activeKey?.id}*/}
   {/* keys={keys}*/}
   {/* onActiveKeyChange={setActiveKeyId}*/}
   {/*/>*/}

   {/*<BybitOrdersTable />*/}
  </div>
 );
}

export const Route = createFileRoute("/_protected-by-login/_protected-by-bybit/orders")({
 component: OrdersPage,
});
