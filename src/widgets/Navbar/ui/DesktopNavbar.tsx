import { Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { authClient } from "@/shared/auth";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui";
import { Logo } from "@/shared/ui/Logo.tsx";
import { navbarConfig } from "../configs/navbarConfig";

interface DesktopNavbarProps {
 className?: string;
}

export const DesktopNavbar = (props: DesktopNavbarProps) => {
 const { className } = props;

 const { user } = useRouteContext({ from: "/_protected-by-login" });
 const navigate = useNavigate();

 async function handleLogout() {
  await authClient.signOut();
  await navigate({ to: "/sign-in" });
 }

 return (
  <aside
   className={cn(
    className,
    `hidden w-60 shrink-0 border-r border-slate-700 bg-slate-900 md:block`,
   )}>
   <nav className="flex h-full flex-col">
    <Link className="p-3 text-lg font-bold text-slate-100 no-underline" to="/">
     <Logo className="w-full" />
    </Link>

    <div className="flex-1 overflow-y-auto p-3">
     {navbarConfig.map(({ groupItems, groupLabel }) => (
      <div className="mt-6" key={groupLabel}>
       <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
        {groupLabel}
       </p>

       <div className="space-y-1">
        {groupItems.map(({ icon: Icon, label, linkOptions }) => (
         <Link
          activeProps={{ className: "bg-slate-800 text-slate-100" }}
          key={linkOptions.to}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 no-underline transition hover:bg-slate-800 hover:text-slate-100"
          {...linkOptions}>
          <Icon size={18} />
          {label}
         </Link>
        ))}
       </div>
      </div>
     ))}
    </div>

    <div className="border-t border-slate-700 p-3">
     <div className="mb-2 px-3">
      <p className="truncate text-sm font-medium text-slate-100">{user?.name}</p>
      <p className="truncate text-xs text-slate-400">{user?.email}</p>
     </div>
     <Button
      className="w-full justify-start gap-3"
      onClick={handleLogout}
      size="sm"
      variant="ghost">
      <LogOut size={16} />
      Sign Out
     </Button>
    </div>
   </nav>
  </aside>
 );
};
