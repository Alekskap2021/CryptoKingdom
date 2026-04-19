import { DesktopNavbar } from "./DesktopNavbar";
import { MobileNavbar } from "./MobileNavbar";

export const Navbar = () => {
 return (
  <>
   <DesktopNavbar className="hidden md:block" />
   <MobileNavbar className="flex items-center justify-between md:hidden" />
  </>
 );
};
