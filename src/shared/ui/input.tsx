import { type InputHTMLAttributes, type RefObject } from "react";
import { cn } from "../lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
 error?: boolean;
}

export const Input = function Input({
 className,
 error,
 ref,
 ...props
}: InputProps & { ref?: RefObject<HTMLInputElement | null> }) {
 return (
  <input
   className={cn(
    `flex h-9 w-full rounded-lg border bg-(--surface-strong) px-3 py-1.5 text-sm text-(--sea-ink) transition placeholder:text-(--sea-ink-soft)/60 focus:ring-2 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
    error ? `border-red-500 focus:ring-red-500` : `border-(--line) focus:ring-(--lagoon)`,
    className,
   )}
   ref={ref}
   {...props}
  />
 );
};
