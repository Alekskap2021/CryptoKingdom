import IconLogoFull from "../assets/logo-full.svg?react";
import IconLogoSmall from "../assets/logo-short.svg?react";
import { cn } from "../lib/cn.ts";

interface LogoProps {
 className?: string;
 isShort?: boolean;
}

export const Logo = (props: LogoProps) => {
 const { className, isShort = false } = props;

 return isShort ? (
  <IconLogoSmall className={cn(className)} width={29} height={35} />
 ) : (
  <IconLogoFull className={cn(className)} width={105} height={40} />
 );
};
