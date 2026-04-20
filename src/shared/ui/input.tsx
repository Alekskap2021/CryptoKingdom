import { Input as InputBase } from "@base-ui/react/input";
import { type ComponentProps } from "react";
import { cn } from "../lib/cn";

export const Input = ({ className, ...props }: ComponentProps<typeof InputBase>) => {
 return (
  <InputBase
   className={cn(
    `flex h-9 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 transition placeholder:text-slate-500`,
    "focus:border-teal-400/50 focus:outline-none",
    "hover:bg-slate-900/50",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "group-data-invalid:border-red-800 group-data-invalid:focus:border-red-800",
    className,
   )}
   {...props}
  />
 );
};
