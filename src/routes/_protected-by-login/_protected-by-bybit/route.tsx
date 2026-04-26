import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { apiKeyMiddleware, getSelectedApiKey } from "@/features/ManageBybitApiKey";

export const Route = createFileRoute("/_protected-by-login/_protected-by-bybit")({
 beforeLoad: ({ location }) => {
  const selectedApiKeyId = getSelectedApiKey();
  if (!selectedApiKeyId) {
   throw redirect({
    search: { redirect: location.pathname },
    to: "/no-bybit-api-key",
   });
  }
  return { selectedApiKeyId };
 },
 component: RouteComponent,
 server: {
  middleware: [apiKeyMiddleware],
 },
});

function RouteComponent() {
 return <Outlet />;
}
