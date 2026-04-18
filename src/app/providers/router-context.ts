import type { QueryClient } from "@tanstack/react-query";

export interface SessionUser {
 email: string;
 id: string;
 name: string;
}

export interface RouterContext {
 queryClient: QueryClient;
 user?: SessionUser;
}
