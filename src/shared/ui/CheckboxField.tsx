import { Checkbox, Field } from "@base-ui/react";
import { CheckIcon } from "lucide-react";
import { cn } from "../lib/cn.ts";
import type { ComponentProps } from "react";

interface CheckboxFieldProps extends ComponentProps<typeof Field.Root> {
 checkboxProps?: ComponentProps<typeof Checkbox.Root>;
}

export const CheckboxField = (props: CheckboxFieldProps) => {
 const { checkboxProps, children, ...otherRootProps } = props;
 const { className, ...otherCheckboxProps } = checkboxProps || {};

 return (
  <Field.Root {...otherRootProps}>
   <Field.Label className="group flex cursor-pointer items-center gap-2 text-sm">
    <Checkbox.Root
     className={cn(
      "peer flex size-5 items-center justify-center rounded-sm border border-teal-400 transition-colors",
      "data-checked:bg-teal-400",
      "data-invalid:border-red-800",
      className,
     )}
     {...otherCheckboxProps}>
     <Checkbox.Indicator className="flex items-center justify-center text-white opacity-100 transition-opacity data-unchecked:opacity-0">
      <CheckIcon className="size-4" />
     </Checkbox.Indicator>
    </Checkbox.Root>
    <span className="text-slate-400 transition-colors group-data-invalid:text-red-800 peer-data-checked:text-white">
     {children}
    </span>
   </Field.Label>
  </Field.Root>
 );
};
