import { Button as ButtonBase } from "@base-ui/react/button";
import { type ComponentProps, type RefObject } from "react";
import { cn } from "../lib/cn";

const variants = {
 clean: "",
 danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
 ghost: "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
 outline: "border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800",
 primary: "bg-teal-600 text-white hover:bg-teal-500 focus-visible:ring-teal-500",
 secondary: "border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-900",
} as const;

const sizes = {
 icon: "size-9 p-0",
 lg: "h-11 px-6 text-base",
 md: "h-9 px-4 text-sm",
 sm: "h-7 px-3 text-xs",
} as const;

export interface ButtonProps extends ComponentProps<typeof ButtonBase> {
 size?: keyof typeof sizes;
 variant?: keyof typeof variants;
}

export const Button = function Button({
 className,
 disabled,
 ref,
 size = "md",
 variant = "primary",
 ...props
}: ButtonProps & { ref?: RefObject<HTMLButtonElement | null> }) {
 return (
  <ButtonBase
   className={cn(
    `inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50`,
    variants[variant],
    sizes[size],
    className,
   )}
   disabled={disabled}
   ref={ref}
   {...props}
  />
 );
};
