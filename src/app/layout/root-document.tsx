import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import tanstackQueryDevtools from "../devtools/tanstack-query";
import { SiteFooter } from "../layout/site-footer";
import { SiteHeader } from "../layout/site-header";
import type { ReactNode } from "react";

export const RootDocument = ({ children }: { children: ReactNode }) => {
 return (
  <html lang="en" suppressHydrationWarning>
   <head>
    <HeadContent />
   </head>
   <body
    className="
      font-sans wrap-anywhere antialiased
      selection:bg-[rgba(79,184,178,0.24)]
    ">
    <SiteHeader />
    {children}
    <SiteFooter />
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
