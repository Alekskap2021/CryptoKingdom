import { Form } from "@base-ui/react";
import { useSearch } from "@tanstack/react-router";
import { useValidateForm } from "@/shared/hooks/useValidateForm.ts";
import { cn } from "@/shared/lib/cn.ts";
import { Button, Card, CardHeader, CardTitle, Input } from "@/shared/ui";
import { Field } from "@/shared/ui/Field.tsx";
import { useMutateVerifyTotp } from "../hooks/useMutateVerifyTotp.ts";
import { signInTotpSchema, type SignInTotpInput } from "../model/signIn.ts";

interface TwoFactorFormProps {
 className?: string;
}

export const TwoFactorForm = (props: TwoFactorFormProps) => {
 const { className } = props;

 const { redirect = "/", twoFactorMethod } = useSearch({ from: "/_auth/two-factor-verify" });

 const { error, isError, isPending, mutateAsync } = useMutateVerifyTotp(redirect);

 const { errors, validateField, validateForm } = useValidateForm(signInTotpSchema);

 const validateTotpField =
  (fieldName: keyof SignInTotpInput) => (_value: unknown, formValues: Record<string, unknown>) =>
   validateField(fieldName, formValues as Form.Values<SignInTotpInput>);

 const handleSubmit = async (values: SignInTotpInput) => {
  const { errors } = validateForm(values);
  if (errors.code) return;
  else await mutateAsync(values);
 };

 return twoFactorMethod === "totp" ? (
  <Card className={cn("w-full max-w-sm", className)}>
   <CardHeader>
    <CardTitle>Two-Factor Authentication</CardTitle>
   </CardHeader>
   <Form className="space-y-4" errors={errors} validationMode="onBlur" onFormSubmit={handleSubmit}>
    <Field
     label="Enter the code from your authenticator app"
     name="code"
     validate={validateTotpField("code")}>
     <Input autoComplete="one-time-code" inputMode="numeric" maxLength={6} placeholder="000000" />
    </Field>

    {isError && <p className="text-sm text-red-600">{error.message}</p>}

    <Button className="w-full" type="submit" disabled={isPending}>
     Verify
    </Button>
   </Form>
  </Card>
 ) : null;
};
