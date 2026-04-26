import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { ManageApiKey } from "@/features/ManageBybitApiKey";

function ApiKeysPage() {
 return <ManageApiKey />;
}

const apiKeySearchSchema = z.object({
 apiKeyId: z.string().optional(),
});

export const Route = createFileRoute("/_protected-by-login/api-keys")({
 component: ApiKeysPage,
 validateSearch: apiKeySearchSchema,
});
