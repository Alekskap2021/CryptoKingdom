import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authMiddleware, getSession } from "@/features/Authentication/server";
import { listApiKeys } from "@/features/ManageBybitApiKey";
import { Navbar } from "@/widgets/Navbar";

function MainLayout() {
 return (
  <div className="flex min-h-screen">
   <Navbar />

   <div className="flex flex-1 flex-col">
    <header className="flex items-center gap-3 border-b border-(--line) bg-(--surface-strong) px-4 py-3 md:hidden">
     <span className="text-sm font-bold text-(--sea-ink)">CryptoKingdom</span>
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

  return {
   apiKeysList,
   user: session?.user,
  };
 },

 component: MainLayout,
 server: {
  middleware: [authMiddleware],
 },
});
