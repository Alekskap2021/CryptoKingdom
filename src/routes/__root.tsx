import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { NotFoundFallback } from "@/widgets/Fallbacks/NotFoundFallback";
import { PendingFallback } from "@/widgets/Fallbacks/PendingFallback";
import tanstackQueryDevtools from "@/app/devtools/tanstack-query";
import type { RouterContext } from "@/app/providers/router-context.ts";
import appCss from "@/app/styles/global.css?url";
import type { ReactNode } from "react";

export const RootDocument = ({ children }: { children: ReactNode }) => {
 return (
  <html lang="en" suppressHydrationWarning>
   <head>
    <HeadContent />
   </head>
   <body className="font-sans wrap-anywhere antialiased selection:bg-teal-500/25">
    {children}
    <TanStackDevtools
     config={{
      position: "bottom-right",
     }}
     plugins={[
      {
       name: "Tanstack Router",
       render: <TanStackRouterDevtoolsPanel />,
      },
      tanstackQueryDevtools,
     ]}
    />
    <Scripts />
   </body>
  </html>
 );
};

export const Route = createRootRouteWithContext<RouterContext>()({
 // errorComponent: ErrorFallback,
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
 notFoundComponent: () => <NotFoundFallback />,
 pendingComponent: PendingFallback,
 shellComponent: RootDocument,
});
