import { createFileRoute, Outlet } from "@tanstack/react-router";
import z from "zod";

const authLayoutSearchSchema = z.object({
 redirect: z.string().optional(),
});

export const Route = createFileRoute("/_auth")({
 component: AuthLayout,
 validateSearch: authLayoutSearchSchema,
});

function AuthLayout() {
 return (
  <main className="flex h-svh w-svw items-center justify-center px-4">
   <Outlet />
  </main>
 );
}
