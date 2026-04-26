import { Radio as RadioBase } from "@base-ui/react/radio";
import { cn } from "../lib/cn.ts";
import type { ComponentProps, ReactNode } from "react";

const RadioRoot = (props: ComponentProps<typeof RadioBase.Root>) => {
 const { className, ...otherProps } = props;
 return (
  <RadioBase.Root
   className={cn(
    "flex size-4.5 items-center justify-center rounded-full border transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800",
    "data-checked:border-teal-400",
    "data-unchecked:border-slate-400",
    className,
   )}
   {...otherProps}
  />
 );
};

const RadioIndicator = (props: ComponentProps<typeof RadioBase.Indicator>) => {
 const { className, ...otherProps } = props;
 return (
  <RadioBase.Indicator
   className={cn(
    "flex transition-opacity before:size-2 before:rounded-full before:bg-teal-400 before:content-['']",
    "data-unchecked:opacity-0",
    className,
   )}
   {...otherProps}
  />
 );
};

interface RadioProps extends ComponentProps<typeof RadioBase.Root> {
 children?: ReactNode;
 indicatorProps?: ComponentProps<typeof RadioBase.Indicator>;
}

export const Radio = (props: RadioProps) => {
 const { children, className, indicatorProps, ...otherRootProps } = props;
 return (
  <label className={cn("cursor-pointer", className)}>
   <RadioRoot {...otherRootProps}>
    <RadioIndicator {...indicatorProps} />
   </RadioRoot>
   {children}
  </label>
 );
};
