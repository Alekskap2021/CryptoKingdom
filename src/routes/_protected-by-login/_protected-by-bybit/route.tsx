import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSelectedApiKey } from "@/shared/helpers/getSelectedApiKey.ts";

export const Route = createFileRoute("/_protected-by-login/_protected-by-bybit")({
 beforeLoad: ({ location }) => {
  const selectedApiKeyId = getSelectedApiKey();

  if (!selectedApiKeyId) {
   throw redirect({
    search: { redirect: location.pathname },
    to: "/no-bybit-api-key",
   });
  }
 },
 component: RouteComponent,
});

function RouteComponent() {
 return <Outlet />;
}
