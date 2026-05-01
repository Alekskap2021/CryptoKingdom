import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { apiKeysQueryOptions, ManageApiKey } from "@/widgets/ManageApiKey";

function ApiKeysPage() {
 return <ManageApiKey />;
}

const apiKeySearchSchema = z.object({
 apiKeyId: z.string().optional(),
 modal: z.enum(["delete", "edit"]).optional(),
});

export const Route = createFileRoute("/_protected-by-login/api-keys")({
 component: ApiKeysPage,
 validateSearch: apiKeySearchSchema,
 // eslint-disable-next-line perfectionist/sort-objects
 loader: ({ context }) => context.queryClient.ensureQueryData(apiKeysQueryOptions),
});
