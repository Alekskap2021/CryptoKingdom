import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { getRouterContext } from "../providers/tanstack-query";
import { routeTree } from "@/routeTree.gen";

export function getRouter() {
 const context = getRouterContext();

 const router = createTanStackRouter({
  context,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  routeTree,
  scrollRestoration: true,
 });

 setupRouterSsrQueryIntegration({ queryClient: context.queryClient, router });

 return router;
}
