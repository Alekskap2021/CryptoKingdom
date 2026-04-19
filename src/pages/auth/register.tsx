import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button, Card, CardHeader, CardTitle, Input, Label } from "@/shared/ui";
import { authClient, registerSchema, type RegisterInput } from "@/features/Authentication";

function RegisterPage() {
 const navigate = useNavigate();
 const [error, setError] = useState<null | string>(null);
 const [loading, setLoading] = useState(false);
 const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({});

 async function handleRegister(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError(null);
  setFieldErrors({});
  setLoading(true);

  const formData = new FormData(e.currentTarget);
  const raw = {
   email: formData.get("email") as string,
   name: formData.get("name") as string,
   password: formData.get("password") as string,
   passwordConfirm: formData.get("passwordConfirm") as string,
  };

  const result = registerSchema.safeParse(raw);
  if (!result.success) {
   const errors: Partial<Record<keyof RegisterInput, string>> = {};
   for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof RegisterInput;
    if (!errors[key]) errors[key] = issue.message;
   }
   setFieldErrors(errors);
   setLoading(false);
   return;
  }

  const { error: authError } = await authClient.signUp.email({
   email: result.data.email,
   name: result.data.name,
   password: result.data.password,
  });

  if (authError) {
   setError(authError.message || "Registration failed. Please try again.");
   setLoading(false);
   return;
  }

  await navigate({ to: "/" });
 }

 return (
  <main className="flex min-h-[80vh] items-center justify-center px-4">
   <Card className="w-full max-w-sm">
    <CardHeader>
     <CardTitle>Create Account</CardTitle>
    </CardHeader>
    <form className="space-y-4" onSubmit={handleRegister}>
     <div className="space-y-1.5">
      <Label htmlFor="name">Name</Label>
      <Input
       autoComplete="name"
       error={!!fieldErrors.name}
       id="name"
       name="name"
       placeholder="John Doe"
       required
      />
      {fieldErrors.name && <p className="text-xs text-red-600">{fieldErrors.name}</p>}
     </div>
     <div className="space-y-1.5">
      <Label htmlFor="email">Email</Label>
      <Input
       autoComplete="email"
       error={!!fieldErrors.email}
       id="email"
       name="email"
       placeholder="you@example.com"
       required
       type="email"
      />
      {fieldErrors.email && <p className="text-xs text-red-600">{fieldErrors.email}</p>}
     </div>
     <div className="space-y-1.5">
      <Label htmlFor="password">Password</Label>
      <Input
       autoComplete="new-password"
       error={!!fieldErrors.password}
       id="password"
       name="password"
       placeholder="••••••••"
       required
       type="password"
      />
      {fieldErrors.password && <p className="text-xs text-red-600">{fieldErrors.password}</p>}
     </div>
     <div className="space-y-1.5">
      <Label htmlFor="passwordConfirm">Confirm Password</Label>
      <Input
       autoComplete="new-password"
       error={!!fieldErrors.passwordConfirm}
       id="passwordConfirm"
       name="passwordConfirm"
       placeholder="••••••••"
       required
       type="password"
      />
      {fieldErrors.passwordConfirm && (
       <p className="text-xs text-red-600">{fieldErrors.passwordConfirm}</p>
      )}
     </div>
     {error && <p className="text-sm text-red-600">{error}</p>}
     <Button className="w-full" disabled={loading} type="submit">
      {loading ? "Creating account..." : "Sign Up"}
     </Button>
    </form>
    <p className="mt-4 text-center text-sm text-slate-400">
     Already have an account?{" "}
     <Link className="font-medium text-teal-400" to="/auth/login">
      Sign In
     </Link>
    </p>
   </Card>
  </main>
 );
}

export const Route = createFileRoute("/auth/register")({
 component: RegisterPage,
});
