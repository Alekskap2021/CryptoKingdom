import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authMiddleware } from "@/shared/auth/server";
import { getSession } from "@/shared/helpers/getSession";
import { Logo } from "@/shared/ui/Logo.tsx";
import { getSelectedApiKey, listApiKeys } from "@/features/ManageBybitApiKey";
import { Navbar } from "@/widgets/Navbar";

function MainLayout() {
 return (
  <div className="relative flex min-h-screen">
   <Navbar />

   <div className="flex flex-1 flex-col">
    <header className="flex items-center gap-3 border-b border-slate-700 bg-slate-900 px-4 py-3 md:hidden">
     <Logo isShort />
    </header>

    <main className="flex-1 overflow-y-auto p-4 md:p-6">
     <Outlet />
    </main>
   </div>
  </div>
 );
}

export const Route = createFileRoute("/_protected-by-login")({
 beforeLoad: async () => {
  const session = await getSession();
  const apiKeysList = await listApiKeys();
  const selectedApiKeyId = getSelectedApiKey();

  return {
   apiKeysList,
   selectedApiKeyId,
   user: session.user,
  };
 },

 component: MainLayout,
 server: {
  middleware: [authMiddleware],
 },
});
