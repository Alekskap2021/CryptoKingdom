import { createFileRoute } from "@tanstack/react-router";
import { ManageApiKey } from "@/features/ManageBybitApiKey";

function ApiKeysPage() {
 return <ManageApiKey />;
}

export const Route = createFileRoute("/_protected-by-login/api-keys")({
 component: ApiKeysPage,
});
