import { type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

const variants = {
 danger: "border border-red-900/50 bg-red-950/50 text-red-300",
 default: "border border-slate-700 bg-slate-800 text-slate-400",
 info: "border border-blue-900/50 bg-blue-950/50 text-blue-300",
 success: "border border-emerald-900/50 bg-emerald-950/50 text-emerald-300",
 warning: "border border-amber-900/50 bg-amber-950/50 text-amber-300",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
 variant?: keyof typeof variants;
}

export const Badge = function Badge({
 className,
 ref,
 variant = "default",
 ...props
}: BadgeProps & { ref?: React.RefObject<HTMLSpanElement | null> }) {
 return (
  <span
   className={cn(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
    variants[variant],
    className,
   )}
   ref={ref}
   {...props}
  />
 );
};
