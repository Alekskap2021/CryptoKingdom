import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { getSelectedApiKey } from "@/shared/helpers/getSelectedApiKey.ts";

export const Route = createFileRoute("/_protected-by-login/no-bybit-api-key")({
 beforeLoad: async () => {
  const selectedApiKeyId = getSelectedApiKey();
  if (selectedApiKeyId) {
   throw redirect({ to: "/" });
  }
 },
 component: RouteComponent,
});

function RouteComponent() {
 return (
  <div className="my-auto flex h-full flex-col items-center justify-center gap-4 text-center">
   <div className="flex size-16 items-center justify-center rounded-full bg-slate-800">
    <KeyRound className="size-8 text-slate-400" />
   </div>

   <h2 className="text-xl font-bold text-slate-100">No API Keys</h2>

   <p className="max-w-sm text-sm text-slate-400">
    Add a Bybit API key to start viewing your account data.
   </p>
   <Link
    className="inline-flex h-9 items-center rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white no-underline transition hover:bg-teal-500"
    to="/api-keys">
    Add API Key
   </Link>
  </div>
 );
}
