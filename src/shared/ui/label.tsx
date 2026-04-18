import { type LabelHTMLAttributes, type RefObject } from "react";
import { cn } from "../lib/cn";

export const Label = function Label({
 className,
 ref,
 ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { ref?: RefObject<HTMLLabelElement | null> }) {
 return (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <label className={cn("text-sm font-medium text-(--sea-ink)", className)} ref={ref} {...props} />
 );
};
