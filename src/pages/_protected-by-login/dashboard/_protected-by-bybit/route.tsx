import { createFileRoute, Outlet } from "@tanstack/react-router";
import { apiKeyMiddleware, listApiKeys } from "@/features/ManageBybitApiKey";

export const Route = createFileRoute("/_protected-by-login/dashboard/_protected-by-bybit")({
 beforeLoad: async () => {
  const apiKeysList = await listApiKeys();

  return {
   apiKeysList,
  };
 },
 component: RouteComponent,
 server: {
  middleware: [apiKeyMiddleware],
 },
});

function RouteComponent() {
 return <Outlet />;
}
