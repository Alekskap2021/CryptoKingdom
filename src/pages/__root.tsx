import { createRootRouteWithContext } from "@tanstack/react-router";
// eslint-disable-next-line @conarti/feature-sliced/layers-slices
import { ErrorFallback } from "@/app/layout/error-fallback.tsx";
// eslint-disable-next-line @conarti/feature-sliced/layers-slices
import { NotFoundFallback } from "@/app/layout/not-found-fallback.tsx";
// eslint-disable-next-line @conarti/feature-sliced/layers-slices
import { PendingFallback } from "@/app/layout/pending-fallback.tsx";
// eslint-disable-next-line @conarti/feature-sliced/layers-slices
import { RootDocument } from "@/app/layout/root-document.tsx";
import type { RouterContext } from "@/app/providers/router-context.ts";
// eslint-disable-next-line @conarti/feature-sliced/layers-slices
import appCss from "@/app/styles/global.css?url";

export const Route = createRootRouteWithContext<RouterContext>()({
 errorComponent: ErrorFallback,
 head: () => ({
  links: [
   {
    href: appCss,
    rel: "stylesheet",
   },
  ],
  meta: [
   {
    charSet: "utf-8",
   },
   {
    content: "width=device-width, initial-scale=1",
    name: "viewport",
   },
   {
    title: "CryptoKingdom",
   },
  ],
 }),
 notFoundComponent: NotFoundFallback,
 pendingComponent: PendingFallback,
 shellComponent: RootDocument,
});
