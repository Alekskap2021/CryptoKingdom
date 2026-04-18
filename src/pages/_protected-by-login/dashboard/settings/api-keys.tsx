import { createFileRoute } from "@tanstack/react-router";
import { listApiKeys, ManageApiKey } from "#/features/ManageBybitApiKey";

function ApiKeysPage() {
 return <ManageApiKey />;
}

export const Route = createFileRoute("/_protected-by-login/dashboard/settings/api-keys")({
 beforeLoad: async () => {
  const apiKeysList = await listApiKeys();

  return {
   apiKeysList,
  };
 },
 component: ApiKeysPage,
});
