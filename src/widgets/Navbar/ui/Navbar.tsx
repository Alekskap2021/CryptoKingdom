import { Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui";
import { authClient } from "@/features/Authentication";
import { navbarConfig } from "../configs/navbarConfig";

interface NavbarProps {
 className?: string;
}

export const Navbar = (props: NavbarProps) => {
 const { className } = props;

 const { user } = useRouteContext({ from: "/_protected-by-login" });
 const navigate = useNavigate();

 async function handleLogout() {
  await authClient.signOut();
  await navigate({ to: "/auth/login" });
 }

 return (
  <aside
   className={cn(
    className,
    `hidden w-60 shrink-0 border-r border-(--line) bg-(--surface-strong) md:block`,
   )}>
   <nav className="flex h-full flex-col">
    <div className="border-b border-(--line) p-4">
     <Link className="text-lg font-bold text-(--sea-ink) no-underline" to="/dashboard">
      CryptoKingdom
     </Link>
    </div>

    <div className="flex-1 overflow-y-auto p-3">
     {navbarConfig.map(({ groupItems, groupLabel }) => (
      <div className="mt-6" key={groupLabel}>
       <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-(--sea-ink-soft)/60 uppercase">
        {groupLabel}
       </p>

       <div className="space-y-1">
        {groupItems.map(({ icon: Icon, label, linkOptions }) => (
         <Link
          activeProps={{ className: "bg-(--surface) text-(--sea-ink)" }}
          key={linkOptions.to}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-(--sea-ink-soft) no-underline transition hover:bg-(--surface) hover:text-(--sea-ink)"
          {...linkOptions}>
          <Icon size={18} />
          {label}
         </Link>
        ))}
       </div>
      </div>
     ))}
    </div>

    <div className="border-t border-(--line) p-3">
     <div className="mb-2 px-3">
      <p className="truncate text-sm font-medium text-(--sea-ink)">{user?.name}</p>
      <p className="truncate text-xs text-(--sea-ink-soft)">{user?.email}</p>
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
