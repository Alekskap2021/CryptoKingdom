import { Spinner } from "@/shared/ui";

export function PendingFallback() {
 return (
  <main className="flex min-h-[60vh] items-center justify-center">
   <Spinner className="text-teal-400" size={32} />
  </main>
 );
}
