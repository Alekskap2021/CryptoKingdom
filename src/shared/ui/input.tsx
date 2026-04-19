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
    `flex h-9 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 transition placeholder:text-slate-500 focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-950 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
    error ? `border-red-500 focus:ring-red-500` : `focus:ring-teal-500`,
    className,
   )}
   ref={ref}
   {...props}
  />
 );
};
