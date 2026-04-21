import { Form } from "@base-ui/react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/shared/auth";
import { useValidateForm } from "@/shared/hooks/useValidateForm.ts";
import { Button, Card, CardHeader, CardTitle } from "@/shared/ui";
import { Field } from "@/shared/ui/Field.tsx";
import { Input } from "@/shared/ui/input.tsx";
import { signUpSchema, type SignUpInput } from "../model/signUp.ts";

export const SignUp = () => {
 const { redirect = "/" } = useSearch({ from: "/_auth" });

 const navigate = useNavigate();
 const [error, setError] = useState<null | string>(null);
 const [isPending, setIsPending] = useState(false);
 const registerForm = useValidateForm(signUpSchema);

 const validateRegisterField =
  (fieldName: keyof SignUpInput) => (_value: unknown, formValues: Record<string, unknown>) =>
   registerForm.validateField(fieldName, formValues as Form.Values<SignUpInput>);

 async function handleSignUp(values: SignUpInput) {
  setError(null);

  const validationResult = registerForm.validateForm(values);
  if (Object.keys(validationResult.errors).length > 0) {
   return;
  }

  setIsPending(true);

  const { error: authError } = await authClient.signUp.email({
   email: values.email,
   name: values.name,
   password: values.password,
  });

  if (authError) {
   setError(authError.message || "Registration failed. Please try again.");
   setIsPending(false);
   return;
  }

  await navigate({ to: "/" });
 }

 return (
  <Card className="w-full max-w-sm">
   <CardHeader>
    <CardTitle>Create Account</CardTitle>
   </CardHeader>
   <Form
    className="space-y-4"
    errors={registerForm.errors}
    validationMode="onBlur"
    onFormSubmit={handleSignUp}>
    <Field label="Name" name="name" validate={validateRegisterField("name")}>
     <Input autoComplete="name" placeholder="John Doe" />
    </Field>

    <Field label="Email" name="email" validate={validateRegisterField("email")}>
     <Input autoComplete="email" placeholder="you@example.com" type="email" />
    </Field>

    <Field label="Password" name="password" validate={validateRegisterField("password")}>
     <Input autoComplete="new-password" placeholder="••••••••" type="password" />
    </Field>

    <Field
     label="Confirm Password"
     name="passwordConfirm"
     validate={validateRegisterField("passwordConfirm")}>
     <Input autoComplete="new-password" placeholder="••••••••" type="password" />
    </Field>

    {error && <p className="text-sm text-red-600">{error}</p>}

    <Button className="w-full" disabled={isPending} type="submit">
     {isPending ? "Creating account..." : "Sign Up"}
    </Button>
   </Form>

   <p className="mt-4 text-center text-sm text-slate-400">
    Already have an account?{" "}
    <Link className="font-medium text-teal-400" to="/sign-in" search={{ redirect }}>
     Sign In
    </Link>
   </p>
  </Card>
 );
};
