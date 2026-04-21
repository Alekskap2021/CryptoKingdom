import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { TwoFactorForm } from "@/features/SignIn";

function TwoFactorPage() {
 return <TwoFactorForm />;
}

const twoFactorSearchSchema = z.object({
 redirect: z.string().optional(),
 twoFactorMethod: z.enum(["otp", "totp"]),
});

export const Route = createFileRoute("/_auth/two-factor-verify")({
 component: TwoFactorPage,
 validateSearch: twoFactorSearchSchema,
});
