import { cn } from "@/shared/lib/cn.ts";
import { Spinner } from "@/shared/ui";

interface PendingFallbackProps {
 className?: string;
}

export const PendingFallback = (props: PendingFallbackProps) => {
 const { className } = props;

 return (
  <main className={cn("flex min-h-[60vh] items-center justify-center", className)}>
   <Spinner className="text-teal-400" size={32} />
  </main>
 );
};
