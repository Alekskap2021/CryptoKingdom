import { createFileRoute, Outlet } from "@tanstack/react-router";
import { apiKeyMiddleware } from "@/features/ManageBybitApiKey";

export const Route = createFileRoute("/_protected-by-login/_protected-by-bybit")({
 component: RouteComponent,
 server: {
  middleware: [apiKeyMiddleware],
 },
});

function RouteComponent() {
 return <Outlet />;
}
