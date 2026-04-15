import { createRootRouteWithContext } from "@tanstack/react-router";
// eslint-disable-next-line @conarti/feature-sliced/layers-slices
import { RootDocument } from "@/app/layout/root-document.tsx";
import type { RouterContext } from "@/app/providers/router-context.ts";
// eslint-disable-next-line @conarti/feature-sliced/layers-slices
import appCss from "@/app/styles/global.css?url";

export const Route = createRootRouteWithContext<RouterContext>()({
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
    title: "TanStack Start Starter",
   },
  ],
 }),
 shellComponent: RootDocument,
});
