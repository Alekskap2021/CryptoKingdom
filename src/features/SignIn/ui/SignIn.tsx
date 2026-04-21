import { Form } from "@base-ui/react";
import { Link, useSearch } from "@tanstack/react-router";
import { useValidateForm } from "@/shared/hooks/useValidateForm.ts";
import { cn } from "@/shared/lib/cn.ts";
import { Button, Card, CardHeader, CardTitle } from "@/shared/ui";
import { Field } from "@/shared/ui/Field.tsx";
import { Input } from "@/shared/ui/input.tsx";
import { useMutateSignIn } from "../hooks/useMutateSignIn.ts";
import { signInSchema, type SignInInput } from "../model/signIn.ts";

interface SignInProps {
 className?: string;
}

export const SignIn = (props: SignInProps) => {
 const { className } = props;

 const { redirect = "/" } = useSearch({ from: "/_auth/sign-in" });

 const { error, isError, isPending, mutateAsync } = useMutateSignIn(redirect);

 const { errors, validateField, validateForm } = useValidateForm(signInSchema);

 const validateCredentialsField =
  (fieldName: keyof SignInInput) => (_value: unknown, formValues: Record<string, unknown>) =>
   validateField(fieldName, formValues as Form.Values<SignInInput>);

 async function handleSignIn(values: SignInInput) {
  const validationResult = validateForm(values);
  if (Object.keys(validationResult.errors).length > 0) return;

  await mutateAsync(values);
 }

 return (
  <Card className={cn("w-full max-w-sm", className)}>
   <CardHeader>
    <CardTitle>Sign In</CardTitle>
   </CardHeader>
   <Form className="space-y-4" errors={errors} validationMode="onBlur" onFormSubmit={handleSignIn}>
    <Field label="Email" name="email" validate={validateCredentialsField("email")}>
     <Input autoComplete="email" placeholder="you@example.com" type="email" />
    </Field>

    <Field label="Password" name="password" validate={validateCredentialsField("password")}>
     <Input autoComplete="current-password" placeholder="••••••••" type="password" />
    </Field>

    {isError && <p className="text-sm text-red-600">{error.message}</p>}

    <Button className="w-full" type="submit" disabled={isPending}>
     Sign In
    </Button>
   </Form>

   <p className="mt-4 text-center text-sm text-slate-400">
    Don&apos;t have an account?{" "}
    <Link className="font-medium text-teal-400" to="/sign-up" search={{ redirect }}>
     Sign Up
    </Link>
   </p>
  </Card>
 );
};
