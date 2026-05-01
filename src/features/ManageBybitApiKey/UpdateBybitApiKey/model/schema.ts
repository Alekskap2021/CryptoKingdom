import { z } from "zod";

export const apiKeyUpdateSchema = z.object({
 label: z.string().min(1, "Label is required").max(64),
});
export type ApiKeyUpdateInput = z.infer<typeof apiKeyUpdateSchema>;
