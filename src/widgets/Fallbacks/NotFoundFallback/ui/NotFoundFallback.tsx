import { Link } from "@tanstack/react-router";
import { FileQuestion } from "lucide-react";
import { cn } from "@/shared/lib/cn.ts";

interface NotFoundFallbackProps {
 className?: string;
}

export const NotFoundFallback = (props: NotFoundFallbackProps) => {
 const { className } = props;

 return (
  <main
   className={cn(
    "flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center",
    className,
   )}>
   <div className="flex size-16 items-center justify-center rounded-full bg-slate-800">
    <FileQuestion className="size-8 text-slate-400" />
   </div>

   <div className="space-y-2">
    <h1 className="text-2xl font-bold text-slate-100">Page not found</h1>
    <p className="max-w-md text-sm text-slate-400">
     The page you are looking for doesn&apos;t exist or has been moved.
    </p>
   </div>

   <Link
    className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 px-4 text-sm font-semibold text-slate-100 no-underline transition hover:bg-slate-900"
    to="/">
    Go to Dashboard
   </Link>
  </main>
 );
};
