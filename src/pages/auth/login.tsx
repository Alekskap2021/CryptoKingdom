import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button, Card, CardHeader, CardTitle, Input, Label } from "@/shared/ui";
import { authClient, type LoginInput, loginSchema } from "@/features/Authentication";

function LoginPage() {
 const navigate = useNavigate();
 const search = useSearch({ from: "/auth/login" });
 const [error, setError] = useState<null | string>(null);
 const [loading, setLoading] = useState(false);
 const [twoFactorRequired, setTwoFactorRequired] = useState(false);
 const [totpCode, setTotpCode] = useState("");
 const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});

 async function handleLogin(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError(null);
  setFieldErrors({});
  setLoading(true);

  const formData = new FormData(e.currentTarget);
  const raw = {
   email: formData.get("email") as string,
   password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(raw);
  if (!result.success) {
   const errors: Partial<Record<keyof LoginInput, string>> = {};
   for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof LoginInput;
    if (!errors[key]) errors[key] = issue.message;
   }
   setFieldErrors(errors);
   setLoading(false);
   return;
  }

  const { data, error: authError } = await authClient.signIn.email({
   email: result.data.email,
   password: result.data.password,
  });

  if (authError) {
   setError(authError.message || "Invalid email or password");
   setLoading(false);
   return;
  }

  if (data?.twoFactorRedirect) {
   setTwoFactorRequired(true);
   setLoading(false);
   return;
  }

  const redirectTo = (search as { redirect?: string }).redirect || "/dashboard";
  await navigate({ to: redirectTo });
 }

 async function handleTotpVerify(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError(null);
  setLoading(true);

  const { error: verifyError } = await authClient.twoFactor.verifyTotp({
   code: totpCode,
  });

  if (verifyError) {
   setError(verifyError.message || "Invalid TOTP code");
   setLoading(false);
   return;
  }

  const redirectTo = (search as { redirect?: string }).redirect || "/dashboard";
  await navigate({ to: redirectTo });
 }

 if (twoFactorRequired) {
  return (
   <main className="flex min-h-[80vh] items-center justify-center px-4">
    <Card className="w-full max-w-sm">
     <CardHeader>
      <CardTitle>Two-Factor Authentication</CardTitle>
     </CardHeader>
     <form className="space-y-4" onSubmit={handleTotpVerify}>
      <div className="space-y-1.5">
       <Label htmlFor="totp">Enter the code from your authenticator app</Label>
       <Input
        autoComplete="one-time-code"
        id="totp"
        inputMode="numeric"
        maxLength={6}
        onChange={(e) => setTotpCode(e.target.value)}
        pattern="[0-9]{6}"
        placeholder="000000"
        required
        value={totpCode}
       />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button className="w-full" disabled={loading} type="submit">
       {loading ? "Verifying..." : "Verify"}
      </Button>
     </form>
    </Card>
   </main>
  );
 }

 return (
  <main className="flex min-h-[80vh] items-center justify-center px-4">
   <Card className="w-full max-w-sm">
    <CardHeader>
     <CardTitle>Sign In</CardTitle>
    </CardHeader>
    <form className="space-y-4" onSubmit={handleLogin}>
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
       autoComplete="current-password"
       error={!!fieldErrors.password}
       id="password"
       name="password"
       placeholder="••••••••"
       required
       type="password"
      />
      {fieldErrors.password && <p className="text-xs text-red-600">{fieldErrors.password}</p>}
     </div>
     {error && <p className="text-sm text-red-600">{error}</p>}
     <Button className="w-full" disabled={loading} type="submit">
      {loading ? "Signing in..." : "Sign In"}
     </Button>
    </form>
    <p className="mt-4 text-center text-sm text-slate-400">
     Don&apos;t have an account?{" "}
     <Link className="font-medium text-teal-400" to="/auth/register">
      Sign Up
     </Link>
    </p>
   </Card>
  </main>
 );
}

const loginSearchSchema = z.object({
 redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth/login")({
 component: LoginPage,
 validateSearch: loginSearchSchema,
});
