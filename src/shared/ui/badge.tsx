import { type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

const variants = {
 danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
 default: "bg-(--surface) text-(--sea-ink-soft) border border-(--line)",
 info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
 success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
 warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
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
