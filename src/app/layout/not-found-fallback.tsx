import { Link } from "@tanstack/react-router";
import { FileQuestion } from "lucide-react";

export function NotFoundFallback() {
 return (
  <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
   <div className="flex size-16 items-center justify-center rounded-full bg-(--surface)">
    <FileQuestion className="size-8 text-(--sea-ink-soft)" />
   </div>
   <div className="space-y-2">
    <h1 className="text-2xl font-bold text-(--sea-ink)">Page not found</h1>
    <p className="max-w-md text-sm text-(--sea-ink-soft)">
     The page you are looking for doesn&apos;t exist or has been moved.
    </p>
   </div>
   <Link
    className="inline-flex h-9 items-center justify-center rounded-lg border border-(--line) bg-(--surface) px-4 text-sm font-semibold text-(--sea-ink) no-underline transition hover:bg-(--surface-strong)"
    to="/">
    Go to Dashboard
   </Link>
  </main>
 );
}
