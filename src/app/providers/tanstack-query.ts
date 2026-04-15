import { QueryClient } from "@tanstack/react-query";
import type { RouterContext } from "./router-context";

export function getRouterContext(): RouterContext {
 return {
  queryClient: new QueryClient(),
 };
}
