import { type ButtonHTMLAttributes, type RefObject } from "react";
import { cn } from "../lib/cn";

const variants = {
 danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
 ghost: "text-(--sea-ink-soft) hover:bg-(--surface) hover:text-(--sea-ink)",
 outline: "border border-(--line) bg-transparent text-(--sea-ink) hover:bg-(--surface)",
 primary: "bg-(--lagoon-deep) text-white hover:bg-(--lagoon) focus-visible:ring-(--lagoon)",
 secondary: "bg-(--surface) text-(--sea-ink) border border-(--line) hover:bg-(--surface-strong)",
} as const;

const sizes = {
 icon: "size-9 p-0",
 lg: "h-11 px-6 text-base",
 md: "h-9 px-4 text-sm",
 sm: "h-7 px-3 text-xs",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
  <button
   className={cn(
    `inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50`,
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
