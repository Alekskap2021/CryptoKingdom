import { createFileRoute, Link } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";

export const Route = createFileRoute("/_protected-by-login/dashboard/no-bybit-api-key")({
 component: RouteComponent,
});

function RouteComponent() {
 return (
  <div className="my-auto flex h-full flex-col items-center justify-center gap-4 text-center">
   <div className="flex size-16 items-center justify-center rounded-full bg-(--surface)">
    <KeyRound className="size-8 text-(--sea-ink-soft)" />
   </div>

   <h2 className="text-xl font-bold text-(--sea-ink)">No API Keys</h2>

   <p className="max-w-sm text-sm text-(--sea-ink-soft)">
    Add a Bybit API key to start viewing your account data.
   </p>
   <Link
    className="inline-flex h-9 items-center rounded-lg bg-(--lagoon-deep) px-4 text-sm font-semibold text-white no-underline transition hover:bg-(--lagoon)"
    to="/dashboard/settings/api-keys">
    Add API Key
   </Link>
  </div>
 );
}
