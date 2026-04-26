import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@/features/SignIn";

function SignInPage() {
 return <SignIn />;
}

export const Route = createFileRoute("/_auth/sign-in")({
 component: SignInPage,
});
