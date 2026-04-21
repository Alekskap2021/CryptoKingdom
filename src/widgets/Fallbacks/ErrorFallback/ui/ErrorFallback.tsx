import { AlertTriangle } from "lucide-react";
import { cn } from "@/shared/lib/cn.ts";
import { Button } from "@/shared/ui";
import type { ErrorComponentProps } from "@tanstack/react-router";

interface ErrorFallbackProps extends ErrorComponentProps {
 className?: string;
}

export const ErrorFallback = (props: ErrorFallbackProps) => {
 const { className, error, reset } = props;

 return (
  <main
   className={cn(
    "flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center",
    className,
   )}>
   <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
    <AlertTriangle className="size-8 text-red-600" />
   </div>
   <div className="space-y-2">
    <h1 className="text-2xl font-bold text-slate-100">Something went wrong</h1>
    <p className="max-w-md text-sm text-slate-400">
     {error.message || "An unexpected error occurred. Please try again."}
    </p>
   </div>
   <Button onClick={reset} variant="secondary">
    Try again
   </Button>
  </main>
 );
};
