import { Field as FieldBase } from "@base-ui/react/field";
import { withCompoundComponents } from "../helpers/withCompoundComponents.ts";
import { cn } from "../lib/cn.ts";
import type { ComponentProps } from "react";

const FieldRoot = ({ className, ...properties }: ComponentProps<typeof FieldBase.Root>) => {
 return (
  <FieldBase.Root
   className={cn("group flex w-full flex-col items-start gap-1", className)}
   {...properties}
  />
 );
};

const FieldLabel = ({ className, ...properties }: ComponentProps<typeof FieldBase.Label>) => {
 return (
  <FieldBase.Label
   className={cn("text-sm font-medium text-slate-100", className)}
   {...properties}
  />
 );
};

const FieldError = ({ className, ...properties }: ComponentProps<typeof FieldBase.Error>) => {
 return (
  <FieldBase.Error
   className={cn(
    "h-0 text-sm text-red-800 opacity-0 transition-all duration-300 ease-in-out",
    "data-invalid:h-5 data-invalid:opacity-100",
    className,
   )}
   {...properties}
  />
 );
};

const FieldDescription = ({
 className,
 ...properties
}: ComponentProps<typeof FieldBase.Description>) => {
 return (
  <FieldBase.Description className={cn("text-sm text-slate-400", className)} {...properties} />
 );
};

const FieldValidity = (properties: ComponentProps<typeof FieldBase.Validity>) => {
 return <FieldBase.Validity {...properties} />;
};

const FieldItem = (properties: ComponentProps<typeof FieldBase.Item>) => {
 return <FieldBase.Item {...properties} />;
};

interface DieldWrapperProps extends ComponentProps<typeof FieldBase.Root> {
 label?: string;
}

const FieldWrapper = (props: DieldWrapperProps) => {
 const { children, label, ...otherRootProps } = props;

 return (
  <FieldRoot {...otherRootProps}>
   {label ? <FieldLabel>{label}</FieldLabel> : null}
   {children}
   <FieldError />
  </FieldRoot>
 );
};

export const Field = withCompoundComponents(FieldWrapper, {
 Description: FieldDescription,
 Item: FieldItem,
 Validity: FieldValidity,
});
