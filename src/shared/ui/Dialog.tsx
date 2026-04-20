import { Dialog as DialogBase } from "@base-ui/react/dialog";
import { withCompoundComponents } from "../helpers/withCompoundComponents.ts";
import { cn } from "../lib/cn.ts";
import type { ComponentProps } from "react";

const DialogRoot = (properties: ComponentProps<typeof DialogBase.Root>) => {
 return <DialogBase.Root {...properties} />;
};

const Trigger = ({ className, ...properties }: ComponentProps<typeof DialogBase.Trigger>) => {
 return <DialogBase.Trigger className={cn("cursor-pointer", className)} {...properties} />;
};

const Portal = ({ ...properties }: ComponentProps<typeof DialogBase.Portal>) => {
 return <DialogBase.Portal {...properties} />;
};

const Backdrop = ({ className, ...properties }: ComponentProps<typeof DialogBase.Backdrop>) => {
 return (
  <DialogBase.Backdrop
   className={cn(
    "fixed inset-0 min-h-dvh bg-black/50 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute",
    className,
   )}
   {...properties}
  />
 );
};

const Close = (properties: ComponentProps<typeof DialogBase.Close>) => {
 return <DialogBase.Close {...properties} />;
};

const Popup = ({ className, ...properties }: ComponentProps<typeof DialogBase.Popup>) => {
 return (
  <DialogBase.Popup
   className={cn(
    "bg-gradient fixed top-1/2 left-1/2 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl p-6.25 text-white backdrop-blur-[25px] transition-all duration-300 data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0",
    "top-[calc(50%+1.25rem*var(--nested-dialogs))] scale-[calc(1-0.1*var(--nested-dialogs))]",
    "data-nested-dialog-open:after:bg-dark/80 data-nested-dialog-open:after:absolute data-nested-dialog-open:after:inset-0",
    className,
   )}
   {...properties}
  />
 );
};

const Title = ({ className, ...properties }: ComponentProps<typeof DialogBase.Title>) => {
 return (
  <DialogBase.Title
   className={cn(
    className,
    "text-18 768px:text-24 text-center leading-none font-medium text-white",
   )}
   {...properties}
  />
 );
};

const Description = ({
 className,
 ...properties
}: ComponentProps<typeof DialogBase.Description>) => {
 return (
  <DialogBase.Description
   className={cn("max-w-[90%] text-left text-sm leading-4 text-slate-400", className)}
   {...properties}
  />
 );
};

interface ContentProps extends ComponentProps<typeof DialogBase.Popup> {
 description?: string;
 title?: string;
 withCloseButton?: boolean;
}

const Content = (props: ContentProps) => {
 const { children, description, title, withCloseButton = false, ...other } = props;
 return (
  <Portal>
   <Backdrop />
   <Popup {...other}>
    {title || description ? (
     <div className="768px:mb-4 mb-3 flex flex-col items-center gap-3">
      {title ? <Title>{title}</Title> : null}
      {description ? <Description>{description}</Description> : null}
     </div>
    ) : null}
    {children}
    {withCloseButton ? <Close className="mb-0" /> : null}
   </Popup>
  </Portal>
 );
};

export const Dialog = withCompoundComponents(DialogRoot, {
 Close,
 Content,
 createHandle: DialogBase.createHandle,
 Description,
 Title,
 Trigger,
});
