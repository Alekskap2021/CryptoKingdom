import { createFileRoute } from "@tanstack/react-router";
import { SignUp } from "@/features/SignUp";

function SignUpPage() {
 return <SignUp />;
}

export const Route = createFileRoute("/_auth/sign-up")({
 component: SignUpPage,
});
