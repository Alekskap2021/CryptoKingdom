import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/cn.ts";
import { Button } from "@/shared/ui";
import { navbarConfig } from "../configs/navbarConfig";

interface MobileNavbarProps {
 className?: string;
}

export const MobileNavbar = (props: MobileNavbarProps) => {
 const { className } = props;

 const [isSettingsOpened, setIsSettingsOpened] = useState(false);

 const mainLinks = navbarConfig[0].groupItems;
 const settingsLinks = navbarConfig[1].groupItems;

 return (
  <>
   <nav className={cn("fixed inset-x-0 bottom-0 z-20 bg-slate-900 p-4", className)}>
    {mainLinks.map(({ icon: Icon, linkOptions }) => (
     <Link key={linkOptions.to} {...linkOptions}>
      <Icon className="size-6 min-[425px]:size-8" />
     </Link>
    ))}

    <Button
     className={cn("inline-block p-0", { "text-slate-100": isSettingsOpened })}
     variant="clean"
     onClick={() => setIsSettingsOpened((prev) => !prev)}>
     <Settings className="size-6 min-[425px]:size-8" />
    </Button>
   </nav>

   <nav
    className={cn("fixed inset-0 z-10 flex flex-col gap-4 bg-slate-900 p-4 transition-transform", {
     "translate-y-0": isSettingsOpened,
     "translate-y-full": !isSettingsOpened,

     // hidden: !isSettingsOpened,
    })}>
    {settingsLinks.map((link) => {
     const { icon: Icon, label, linkOptions } = link;
     return (
      <Link className="flex items-center gap-2.5" key={linkOptions.to} {...linkOptions}>
       <Icon size={18} />
       {label}
      </Link>
     );
    })}
   </nav>
  </>
 );
};
