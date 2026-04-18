import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authMiddleware, getSession } from "@/features/Authentication/server";

function ProtectedLayout() {
 return <Outlet />;
}

export const Route = createFileRoute("/_protected-by-login")({
 beforeLoad: async () => {
  const session = await getSession();

  return {
   user: session?.user,
  };
 },
 component: ProtectedLayout,
 server: {
  middleware: [authMiddleware],
 },
});
