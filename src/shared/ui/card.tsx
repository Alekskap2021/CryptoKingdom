import { type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
 variant?: "default" | "outlined";
}

export const Card = function Card({
 className,
 ref,
 variant = "default",
 ...props
}: CardProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
 return (
  <div
   className={cn(
    "rounded-xl border border-slate-700 p-5",
    variant === "default" &&
     `bg-linear-to-br from-slate-900 to-slate-800 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_12px_28px_rgba(0,0,0,0.25)]`,
    variant === "outlined" && "bg-transparent",
    className,
   )}
   ref={ref}
   {...props}
  />
 );
};

export const CardHeader = function CardHeader({
 className,
 ref,
 ...props
}: HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) {
 return (
  <div className={cn("mb-4 flex items-center justify-between", className)} ref={ref} {...props} />
 );
};

export const CardTitle = function CardTitle({
 className,
 ref,
 ...props
}: HTMLAttributes<HTMLHeadingElement> & { ref?: React.RefObject<HTMLHeadingElement | null> }) {
 return (
  // eslint-disable-next-line jsx-a11y/heading-has-content
  <h3 className={cn("text-base font-semibold text-slate-100", className)} ref={ref} {...props} />
 );
};
